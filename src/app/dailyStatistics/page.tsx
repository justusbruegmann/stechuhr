"use client"

import Button from "@/components/layout/Button";
import TimeEntry from "@/types/TimeEntry";
import { useModal } from "@/contexts/ModalContext";
import DailyDetailsPane from "@/components/timeAdjustment/DailyDetailsPane";

import styles from "./dailyStatistics.module.css"
import { useState } from "react";

export default function DailyStatistics() {
    const { showModal, hideModal } = useModal();

    const [dailyEntries, setDailyEntries] = useState<TimeEntry[]>([]);

    function showDailyDetails(datum: Date) {
        showModal("sidepane",
            <DailyDetailsPane
                date={datum}
                entries={dailyEntries}
                onAddEntry={(entry: TimeEntry) => setDailyEntries((prev) => [...prev, entry])}
            />
        )
    }

    return (
        <div className={`${styles.container}`}>
            <Button label={"18.02.2026"} type={"primary"} height={3} width={15}
                onClick={() =>
                    showDailyDetails(new Date(2026, 1, 18))}
            />
        </div>
    );
}