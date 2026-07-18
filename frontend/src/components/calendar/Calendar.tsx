'use client';

import Card from "@/components/layout/Card";
import styles from "./Calendar.module.css"
import { useState } from "react";
import Holidays from 'date-holidays';
import TimeEntry from "@/types/TimeEntry";
import { DateString } from "@/types/misc";
import { generateDateString } from "@/utils/TimeUtils";
import User from "@/types/User";


type Props = {
    user?: User;
    showDailyDetails: (date: DateString) => void;
    timeEntries: Record<DateString, TimeEntry[]>
    onMonthChange: (year: number, month: number) => void;
}


export default function Kalender({ user, showDailyDetails, timeEntries, onMonthChange }: Props) {

    // --- Kalender ---
    const timeEntryList = Object.values(timeEntries).flat();

    const today = new Date();
    const [currentDay, setCurrentDay] = useState(new Date());
    const currentMonth = currentDay.getMonth();
    const currentYear = currentDay.getFullYear();

    const daysCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let firstDayMonth = new Date(currentYear, currentMonth, 1).getDay();
    firstDayMonth = (firstDayMonth + 6) % 7;

    const daysArray = [];
    for (let i = 0; i < firstDayMonth; i++) {
        daysArray.push(null);
    }
    for (let day = 1; day <= daysCurrentMonth; day++) {
        daysArray.push(day);
    }

    const remainingDaysMonth = daysArray.length % 7;
    if (remainingDaysMonth !== 0) {
        for (let i = remainingDaysMonth; i < 7; i++) {
            daysArray.push(null);
        }
    }

    // --- Mindestwochenarbeitszeit ---
    const targetHours = user ? user.workload / 5 : 8;
    const lowerThreshold = targetHours * 0.75;

    // --- Wochentage ---
    const weekdays = ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa.", "So."];

    // --- Feiertage ---
    const holidays = new Holidays('DE', 'BW');

    // --- Legende ---
    const symbols = [
        ["Krank", "rgb(0, 0, 0)", "rgba(255, 200, 0, 0.12)", "rgb(255, 180, 0)"],
        ["Urlaub", "rgb(0, 0, 0)", "rgba(180, 50, 240, 0.12)", "rgb(180, 20, 240)"],
        ["WE", "rgb(0, 0, 0)", "rgba(50, 110, 255, 0.12)", "rgb(20, 90, 255)"],
        ["FT", "rgb(0, 0, 0)", "rgba(230, 50, 230, 0.12)", "rgb(230, 10, 230)"],
        [`>${targetHours.toFixed(1)}h`, "rgb(0, 0, 0)", "rgba(0, 255, 0, 0.5)", "rgb(0, 150, 0)"],
        [`${lowerThreshold.toFixed(1)} - ${targetHours.toFixed(1)}h`, "rgb(0, 0, 0)", "rgba(255, 140, 0, 0.5)", "rgb(200, 120, 0)"],
        [`<${lowerThreshold.toFixed(1)}h`, "rgb(0, 0, 0)", "rgba(255, 0, 0, 0.5)", "rgb(200, 0, 0)"]
    ].map(([text, color, backgroundColor, borderColor]) => ({ text, color, backgroundColor, borderColor }));
    const legend1Symbols = symbols.slice(0, 4);
    const legend2Symbols = symbols.slice(4);


    // --- Funktionen ---
    function handleMonthChange(direction: "forward" | "back") {
        const newDate = new Date(currentDay);

        if (direction === "forward") {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
        }

        setCurrentDay(newDate);
        onMonthChange(newDate.getFullYear(), newDate.getMonth());
    }

    function handleToday() {
        const newDate = new Date(today.getFullYear(), today.getMonth(), 1);
        setCurrentDay(newDate);
        onMonthChange(newDate.getFullYear(), newDate.getMonth());
    }

    // Wochenende
    function isWeekend(index: number) {
        return index % 7 === 5 || index % 7 === 6;
    }

    // Feiertag
    function isHoliday(day: number) {
        const holiday = holidays.isHoliday(new Date(currentYear, currentMonth, day));
        return holiday && holiday.some(h => h.type === "public");
    }

    // Krankheit / Urlaub
    function isType(day: number): "sick" | "holiday" | null {
        const dayEntries = timeEntryList.filter((entry: TimeEntry) => {
            const entryDate = new Date(entry.startTime);
            return entryDate.getFullYear() === currentYear &&
                entryDate.getMonth() === currentMonth &&
                entryDate.getDate() === day;
        });

        if (dayEntries.some(e => e.type === "sick")) return "sick";
        if (dayEntries.some(e => e.type === "holiday")) return "holiday";
        return null;
    }

    function handleWorkingHours(day: number) {
        const dayEntries = timeEntryList.filter((entry: any) => {
            const entryDate = new Date(entry.startTime);

            return entry.type === "work" &&
                entryDate.getFullYear() === currentYear &&
                entryDate.getMonth() === currentMonth &&
                entryDate.getDate() === day;
        });

        let totalHours = 0;

        for (const entry of dayEntries) {
            if (!entry.endTime) continue;

            const startTime = new Date(entry.startTime);
            const endTime = new Date(entry.endTime);

            const diff = endTime.getTime() - startTime.getTime();

            totalHours += diff / (1000 * 60 * 60);
        }

        if (totalHours === 0) return -1;

        return Math.round(totalHours * 10) / 10;
    }

    function handleEntries(index: number, day: number) {
        const entries = [];

        // Arbeitszeit
        const workHours = handleWorkingHours(day);
        let symbolIndex: number = -1;

        switch (true) {
            case workHours >= targetHours:
                symbolIndex = 4;
                break;
            case workHours >= targetHours * 0.75:
                symbolIndex = 5;
                break;
            case workHours < targetHours * 0.75:
                symbolIndex = 6;
                break;
        }

        if (workHours !== -1) {
            entries.push(
                <span
                    key={index + "Hours"}
                    className={styles.calendar_symbols}
                    style={{
                        color: symbols[symbolIndex].color,
                        backgroundColor: symbols[symbolIndex].backgroundColor,
                        border: `2px solid ${symbols[symbolIndex].borderColor}`
                    }}
                >
                    {workHours + "h"}
                </span>
            );
        }
        return entries;
    }


    // --- UI ---
    return (
        <Card className={styles.container}>
            <div className={styles.calendar_container}>
                <div className={styles.calendar_header}>
                    <div className={styles.calendar_period}>
                        <div className={styles.calendar_period_text}>{currentYear}</div>
                        <div className={styles.calendar_period_text}>{currentDay.toLocaleDateString("de-DE", { month: "long" })}
                        </div>
                    </div>
                    <div className={styles.calendar_navigation_grid}>
                        <button className={styles.calendar_reset_day} onClick={() => handleToday()}>
                            Heute
                        </button>
                        <button className={styles.calendar_arrow} onClick={() => handleMonthChange("back")}>
                            <img src="/Arrow_Back.svg" alt="" />
                        </button>
                        <button className={styles.calendar_arrow} onClick={() => handleMonthChange("forward")}>
                            <img src="/Arrow_Forward.svg" alt="" />
                        </button>
                    </div>
                </div>
                <hr className={styles.line} />
                <br />

                <div className={styles.calendar_weekdays_grid}>
                    {weekdays.map((weekday, index) => (
                        <div key={index} className={styles.calendar_weekday}>{weekday}</div>
                    ))}
                </div>

                <div className={styles.calendar_grid}>
                    {daysArray.map((day, index) => {
                        if (day === null) {
                            return <div key={index} className={styles.calendar_empty}>{day}</div>;
                        }
                        const weekendStyle = isWeekend(index) ? {
                            backgroundColor: symbols[2].backgroundColor,
                            borderColor: symbols[2].borderColor
                        } : undefined;

                        const holidayStyle = isHoliday(day) ? {
                            backgroundColor: symbols[3].backgroundColor,
                            borderColor: symbols[3].borderColor
                        } : undefined;

                        const entryType = isType(day);
                        const sickStyle = entryType === "sick" ? {
                            backgroundColor: symbols[0].backgroundColor,
                            borderColor: symbols[0].borderColor
                        } : undefined;
                        const vacationStyle = entryType === "holiday" ? {
                            backgroundColor: symbols[1].backgroundColor,
                            borderColor: symbols[1].borderColor
                        } : undefined;

                        const dayStyle = holidayStyle ?? weekendStyle ?? sickStyle ?? vacationStyle;

                        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                            return (
                                <div key={index} className={styles.calendar_today} style={dayStyle}
                                    onClick={() => showDailyDetails(generateDateString(new Date(currentYear, currentMonth, day)))}>                                    {day && <div className={styles.calendar_day_text}>{day}</div>}
                                    <div className={styles.calendar_day_symbols_container}>
                                        {handleEntries(index, day)}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className={styles.calendar_day} style={dayStyle}
                                onClick={() => showDailyDetails(generateDateString(new Date(currentYear, currentMonth, day)))}>                                {day && <div className={styles.calendar_day_text}>{day}</div>}
                                <div className={styles.calendar_day_symbols_container}>
                                    {handleEntries(index, day)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <br />
                <hr className={styles.line} />

                <div className={styles.calendar_legend1}>
                    {legend1Symbols.map((symbol, index) => (
                        <span
                            key={index}
                            className={styles.calendar_symbols}
                            style={{
                                color: symbol.color,
                                backgroundColor: symbol.backgroundColor,
                                border: `2px solid ${symbol.borderColor}`
                            }}
                        >
                            {symbol.text}
                        </span>
                    ))}
                </div>

                <div className={styles.calendar_legend2}>
                    {legend2Symbols.map((symbol, index) => (
                        <span
                            key={index}
                            className={styles.calendar_symbols}
                            style={{
                                color: symbol.color,
                                backgroundColor: symbol.backgroundColor,
                                border: `2px solid ${symbol.borderColor}`
                            }}
                        >
                            {symbol.text}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
}