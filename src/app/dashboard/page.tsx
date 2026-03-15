'use client';

import styles from "./Dashboard.module.css"

import Header from "@/components/layout/Header";
import Timecard from "@/components/timecard/Timecard";
import Calendar from "@/components/calendar/Calendar";
import {useModal} from "@/contexts/ModalContext";
import Overview from "@/components/overview/Overview";
import {useCallback, useEffect, useRef, useState} from "react";
import TimeEntry from "@/types/TimeEntry";
import DailyDetailsPane from "@/components/timeAdjustment/DailyDetailsPane";


export default function Dashboard() {

    const {showModal, updateModalContent} = useModal();
    const [dailyEntries, setDailyEntries] = useState<Record<string, TimeEntry[]>>({});

    const dailyDetailsModalRef = useRef<{ id: string; date: Date } | null>(null);

    const addEntryForDate = (datum: Date, entry: TimeEntry) => {
        setDailyEntries((prev) => ({
            ...prev,
            [datum.toDateString()]: [...(prev[datum.toDateString()] || []), entry]
        }));
    };

    const createDailyDetailsContent = (datum: Date) => (
        <DailyDetailsPane
            date={datum}
            entries={dailyEntries[datum.toDateString()] || []}
            onAddEntry={(entry: TimeEntry) => addEntryForDate(datum, entry)}
        />
    );

    // Update modal content when dailyEntries change
    useEffect(() => {
        if (dailyDetailsModalRef.current) {
            updateModalContent(
                dailyDetailsModalRef.current.id,
                createDailyDetailsContent(dailyDetailsModalRef.current.date)
            );
        }
    }, [dailyEntries, updateModalContent]);

    const openOverviewModal = () => {
        showModal("sidepane", <Overview entries={dailyEntries}/>)
    }

    const showDailyDetails = useCallback((datum: Date) => {
        const { id } = showModal("sidepane", createDailyDetailsContent(datum));
        dailyDetailsModalRef.current = { id, date: datum };
    }, [dailyEntries, showModal, addEntryForDate]);


    return (
        <div className={styles.wrapper}>
            <div className={styles.headerBar}>
                <Header/>
            </div>
            <div className={styles.viewArea}>
                <Timecard openOverview={openOverviewModal} addEntry={addEntryForDate}/>

                <div className={styles.calendarWrapper}>
                    <Calendar showDailyDetails={showDailyDetails}/>
                </div>
            </div>
        </div>
    );
}
