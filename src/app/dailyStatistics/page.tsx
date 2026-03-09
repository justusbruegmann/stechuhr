"use client"

import Button from "@/components/layout/Button";
import TimeEntry from "@/types/TimeEntry";
import DetailEntry from "@/components/overview/DetailEntry";
import { useModal } from "@/contexts/ModalContext";
import ManualEntryPopup from "@/components/timeAdjustment/ManualEntryPopup";

import styles from "./dailyStatistics.module.css"
import { useState } from "react";

export default function DailyStatistics() {
    const { showModal, hideModal } = useModal();

    const [dailyEntries, setDailyEntries] = useState<TimeEntry[]>([]);

    return (
        <div className={`${styles.container}`}>
            <Button label={"18.02.2026"} type={"primary"} height={3} width={15}
                onClick={() =>
                    showModal("sidepane",
                        <div>
                            <h2>Zeiteinträge für 18.02.2026</h2>
                            <br />
                            <hr />
                            <br />
                            <div className={styles["container-nachtragen"]}>
                                <Button label={"Manuell nachtragen"} type={"accent"} height={3} width={15} 
                                 onClick={() => showModal("popup", <ManualEntryPopup onClose={() => hideModal("popup")}
                                 onCreate={(entry) => setDailyEntries((prev) => [...prev, entry])} />)} /> 
                            </div>
                            <br />
                            <hr />
                            <br />
                            {dailyEntries.map((element) => (
                                <DetailEntry key={element.id} timeEntry={element} />
                            ))}
                        </div>
                    )
                } />
        </div>
    );
}