"use client"

import Button from "@/components/layout/Button";
import TimeInput from "../../components/timeAdjustment/TimeInput";
import TimeEntry from "@/types/TimeEntry";
import DetailEntry from "@/components/overview/DetailEntry";
import { useModal } from "@/contexts/ModalContext";

import styles from "./dailyStatistics.module.css"
import { useState } from "react";

export default function DailyStatistics() {
    const { showModal, hideModal } = useModal();
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");

    let popupId: string = "";

    const [dailyEntries, setDailyEntries] = useState<TimeEntry[]>([]);
    function saveButton() {
        createEntry(fromTime, toTime);
        hideModal(popupId);
    }

    function createEntry(from: string, to: string) {
        const id: string = crypto.randomUUID();
        const timeEntry : TimeEntry = {
            id: id,
            userId: "456",
            startTime: from,
            endTime: to
        }

        console.log("Created entry: ", timeEntry);
        setDailyEntries(prev => [...prev, timeEntry]);
        console.log("All entries: ", dailyEntries);
    }

    const popupContent = (
        <div>
            <h2>Manueller Zeiteintrag</h2>
            <br />
            <h3>für den 18.02.2026</h3>
            <br />
            <hr />
            <br />
            <TimeInput
                label="Einstempelzeit"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFromTime(e.target.value)}
                required={true}
            />

            <br />
            <TimeInput
                label="Ausstempelzeit"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setToTime(e.target.value); console.log("To time: ", e.target.value, toTime);}}
                required={true}
            />
            <br />
            <div className={styles["container-popup-buttons"]}>
                <Button label={"Abbrechen"} type={"primary"} height={2.5} width={6} onClick={() => hideModal(popupId)} />
                <Button label={"Eintrag hinzufügen"} type={"accent"} height={2.5} width={9} onClick={() => saveButton()} />
            </div>
        </div>
    );


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
                                <Button label={"Manuell nachtragen"} type={"accent"} height={3} width={15} onClick={() => popupId = showModal("popup", popupContent)} />
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