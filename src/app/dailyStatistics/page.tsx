"use client"

import Button from "@/components/layout/Button";
import TimeInput from "../../components/timeAdjustment/TimeInput";
import { useModal } from "@/contexts/ModalContext";

import styles from "./dailyStatistics.module.css"
import { useState } from "react";

export default function DailyStatistics() {
    const { showModal, hideModal } = useModal();
    const [startTime, setStartTime] = useState("00:00");

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                required={true}
            />

            <br />
            <TimeInput
                label="Ausstempelzeit"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                required={true}
            />
            <br />
            <div className={styles["container-popup-buttons"]}>
                <Button label={"Abbrechen"} type={"primary"} height={2.5} width={6} onClick={hideModal} />
                <Button label={"Eintrag hinzufügen"} type={"accent"} height={2.5} width={9} />
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
                                <Button label={"Manuell nachtragen"} type={"accent"} height={3} width={15} onClick={() => showModal("popup", popupContent)} />
                            </div>
                        </div>
                    )
                } />
        </div>
    );
}