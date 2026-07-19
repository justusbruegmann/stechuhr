"use client";

import {useState} from "react";
import TimeInput from "@/components/timeAdjustment/TimeInput";
import Button from "@/components/layout/Button";
import {useCurrentModal, useModal} from "@/contexts/ModalContext";
import TimeEntry from "@/types/TimeEntry";
import styles from "./ManualEntryPopup.module.css";

type Props = {
  date: Date;
  onCreate: (entry: TimeEntry) => void;
};

export default function ManualEntryPopup({date, onCreate}: Props) {
    const {hideModal} = useModal();

  const { close } = useCurrentModal();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

    const [isChecked, setIsChecked] = useState(true);

    function checkTimeFormat(time: string) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(time);
    }

    function saveButton(isToTimeRequired: boolean = true) {

    const [startHours, startMinutes] = startTime.split(":").map(Number);

    if (isToTimeRequired) {
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      const entry: TimeEntry = {
        id: crypto.randomUUID(),
        userId: "456",
        startTime: new Date(date.setHours(startHours, startMinutes)).toISOString(),
        endTime: new Date(date.setHours(endHours, endMinutes)).toISOString()
      };
      onCreate(entry);
    } else {
      const entry: TimeEntry = {
        id: crypto.randomUUID(),
        userId: "456",
        startTime: new Date(date.setHours(startHours, startMinutes)).toISOString()
      };
      onCreate(entry);
    }
  }

    return (
        <div className={styles["container"]}>
            <h2>Manueller Zeiteintrag</h2>

      <br />
      <div className={styles["container-einstempelzeit"]}>
        <img src="/clock.svg" alt="Clock Icon" className={styles["clock-icon"]} />
        <label className={styles["labels"]}>Einstempelzeit</label>
      </div>

      <TimeInput
        onChange={(e) => setStartTime(e.target.value)}
        required={true}
        visible={true}
      />

            <br/>

            <input
                type="checkbox"
                id="addEndTime"
                className={styles["checkbox"]}
                checked={isChecked}
                onChange={() => isChecked ? setIsChecked(false) : setIsChecked(true)
                }
            />

            <label htmlFor="addEndTime" className={styles["labels"]}>Austempelzeit hinzufügen</label>

      <TimeInput
        onChange={(e) => setEndTime(e.target.value)}
        required={true}
        visible={isChecked}
      />

            <br/>

            <div className={styles["container-popup-buttons"]}>
                <Button
                    label="Abbrechen"
                    type="primary"
                    height={2.5}
                    width={6}
                    onClick={() => {
                        close()
                    }}
                />

        <Button
          label="Eintrag hinzufügen"
          type="accent"
          height={2.5}
          width={9}
          onClick={() => {
            if (isChecked) {
              if (checkTimeFormat(startTime) && checkTimeFormat(endTime)) {
                if (startTime < endTime) {
                  saveButton();
                  close();
                } else {
                  alert("Die Einstempelzeit muss vor der Austempelzeit liegen.");
                }
              } else {
                alert("Bitte beide Zeiten in korrektem Format eingeben.");
              }
            } else {
              if (checkTimeFormat(startTime)) {
                saveButton(false);
                close();
              } else {
                alert("Bitte die Einstempelzeit in korrektem Format eingeben.");
              }
            }
          }
          }
        />
      </div>
    </div>
  );
}