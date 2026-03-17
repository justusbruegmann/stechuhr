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

    /**
     * The dailyEntries state is used as a central state to store a relevant section of all logged time entries for the frontend.
     * It is structured as a map where the key is the date string (Date.toDateString())
     * and the value is an array of TimeEntry objects.
     */
    const [dailyEntries, setDailyEntries] = useState<Record<string, TimeEntry[]>>({});

    const currentlyOpenModal = useRef<
        { id: string; type: "OverviewModal" } |
        { id: string; type: "DailyDetails"; date: Date } |
        null
    >(null);

    const addEntryForDate = (datum: Date, entry: TimeEntry) => {
        setDailyEntries((prev) => ({
            ...prev,
            [datum.toDateString()]: [...(prev[datum.toDateString()] || []), entry]
        }));
    };

    const deleteEntry = (id: string) => {
        console.log(id);

        setDailyEntries((prev) =>
            Object.fromEntries(
                Object.entries(prev).map(([date, entries]) => [
                    date,
                    entries.filter((entry) => entry.id !== id)
                ])
            )
        );
    }

    const createOverviewContent = () => (
        <Overview entries={dailyEntries} deleteEntry={deleteEntry}/>
    );

    const createDailyDetailsContent = (datum: Date) => (
        <DailyDetailsPane
            date={datum}
            entries={dailyEntries[datum.toDateString()] || []}
            onAddEntry={(entry: TimeEntry) => addEntryForDate(datum, entry)}
        />
    );

    // Update modal content when dailyEntries change
    useEffect(() => {
        if (currentlyOpenModal.current) {
            if (currentlyOpenModal.current.type === "DailyDetails") {
                console.log("Trying to update daily details")
                updateModalContent(
                    currentlyOpenModal.current.id,
                    createDailyDetailsContent(currentlyOpenModal.current.date)
                );
            } else if (currentlyOpenModal.current.type === "OverviewModal") {
                updateModalContent(
                    currentlyOpenModal.current.id,
                    createOverviewContent()
                );
            }
        }
    }, [dailyEntries, updateModalContent]);

    const openOverviewModal = useCallback(() => {
        const {id} = showModal("sidepane", <Overview entries={dailyEntries} deleteEntry={deleteEntry}/>)
        currentlyOpenModal.current = {id, type: "OverviewModal"};
    }, [dailyEntries, showModal, addEntryForDate]);

    const showDailyDetails = useCallback((datum: Date) => {
        const {id} = showModal("sidepane", createDailyDetailsContent(datum));
        currentlyOpenModal.current = {id, type: "DailyDetails", date: datum};
    }, [dailyEntries, showModal, addEntryForDate]);


    return (
        <div className={styles.wrapper}>
            <div className={styles.headerBar}>
                <Header name={"dashboard"}/>
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
