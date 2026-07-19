'use client';

import Card from "@/components/layout/Card";
import styles from "./Calendar.module.css"
import {useState} from "react";
import Holidays from 'date-holidays';
import TimeEntry from "@/types/TimeEntry";
import {DateString} from "@/types/misc";
import {generateDateString} from "@/utils/TimeUtils";


type Props = {
    showDailyDetails: (date: DateString) => void;
    timeEntries: Record<string, TimeEntry[]>
}


export default function Kalender({showDailyDetails, timeEntries}: Props) {

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


    // --- Wochentage ---
    const weekdays = ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa.", "So."];

    // --- Feiertage ---
    const holidays = new Holidays('DE', 'BW');

    // --- Legende ---
    const symbols = [
        ["Krank", "rgb(99, 90, 0)", "rgba(255, 234, 0, 0.5)", "rgb(200, 180, 0)"],
        ["Urlaub", "rgb(82, 0, 120)", "rgba(174, 0, 255, 0.5)", "rgb(120, 0, 200)"],
        ["WE", "rgb(0, 37, 116)", "rgba(0, 81, 255, 0.5)", "rgb(0, 37, 200)"],
        ["FT", "rgb(124, 0, 124)", "rgba(255, 0, 255, 0.5)", "rgb(180, 0, 180)"],
        [">8h", "rgb(30, 114, 30)", "rgba(0, 255, 0, 0.5)", "rgb(0, 150, 0)"],
        ["6-8h", "rgb(130, 72, 0)", "rgba(255, 140, 0, 0.5)", "rgb(200, 120, 0)"],
        ["<6h", "rgb(128, 0, 0)", "rgba(255, 0, 0, 0.5)", "rgb(200, 0, 0)"]
    ].map(([text, color, backgroundColor, borderColor]) => ({text, color, backgroundColor, borderColor}));

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
    }

    function handleToday() {
        setCurrentDay(new Date(today.getFullYear(), today.getMonth(), 1));
    }

    function handleWorkingHours(day: number) {
        const dayEntries = timeEntryList.filter((entry: any) => {
            const entryDate = new Date(entry.startTime);

            return entryDate.getFullYear() === currentYear &&
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

        // Wochenende
        if (index % 7 === 5 || index % 7 === 6) {
            entries.push(
                <span
                    className={styles.calendar_symbols}
                    style={{
                        color: symbols[2].color,
                        backgroundColor: symbols[2].backgroundColor,
                        border: `2px solid ${symbols[2].borderColor}`
                    }}
                >
                    {symbols[2].text}
                </span>
            );
        }

        // Feiertag
        const holiday = holidays.isHoliday(new Date(currentYear, currentMonth, day));

        if (holiday && holiday.some(f => f.type === "public")) {
            entries.push(
                <span
                    className={styles.calendar_symbols}
                    style={{
                        color: symbols[3].color,
                        backgroundColor: symbols[3].backgroundColor,
                        border: `2px solid ${symbols[3].borderColor}`
                    }}
                >
                    {symbols[3].text}
                </span>
            );
        }

        // Arbeitszeit
        const workHours = handleWorkingHours(day);
        let symbolIndex: number = -1;

        switch (true) {
            case workHours >= 8:
                symbolIndex = 4;
                break;
            case workHours >= 6:
                symbolIndex = 5;
                break;
            case workHours < 6:
                symbolIndex = 6;
                break;
        }

        if (workHours !== -1) {
            entries.push(
                <span
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
        <Card>
            <div className={styles.calendar_container}>
                <div className={styles.calendar_header}>
                    <div className={styles.calendar_period}>
                        <div className={styles.calendar_period_text}>{currentYear}</div>
                        <div
                            className={styles.calendar_period_text}>{currentDay.toLocaleDateString("de-DE", {month: "long"})}</div>
                    </div>
                    <div className={styles.calendar_navigation_grid}>
                        <button className={styles.calendar_reset_day} onClick={() => handleToday()}>
                            Heute
                        </button>
                        <button className={styles.calendar_arrow} onClick={() => handleMonthChange("back")}>
                            <img src="/Arrow_Back.svg" alt=""/>
                        </button>
                        <button className={styles.calendar_arrow} onClick={() => handleMonthChange("forward")}>
                            <img src="/Arrow_Forward.svg" alt=""/>
                        </button>
                    </div>
                </div>
                <hr className={styles.line}/>
                <br/>

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
                        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                            return (
                                <div key={index} className={styles.calendar_today}
                                     onClick={() => showDailyDetails(generateDateString(new Date(currentYear, currentMonth, day+1)))}>
                                    {day && <div className={styles.calendar_day_text}>{day}</div>}
                                    <div className={styles.calendar_day_symbols_container}>
                                        {handleEntries(index, day)}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className={styles.calendar_day}
                                 onClick={() => showDailyDetails(generateDateString(new Date(currentYear, currentMonth, day+1)))}>
                                {day && <div className={styles.calendar_day_text}>{day}</div>}
                                <div className={styles.calendar_day_symbols_container}>
                                    {handleEntries(index, day)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <br/>
                <hr className={styles.line}/>

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