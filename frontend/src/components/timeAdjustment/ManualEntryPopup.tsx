"use client";

import { useState } from "react";
import TimeInput from "@/components/timeAdjustment/TimeInput";
import Button from "@/components/layout/Button";
import { useCurrentModal, useModal } from "@/contexts/ModalContext";
import TimeEntry from "@/types/TimeEntry";
import styles from "./ManualEntryPopup.module.css";
import { createTimeEntry } from "@/scripts/timeEntriesScript";

type Props = {
  date: Date;
  onCreate: (entry: TimeEntry) => void;
};

export default function ManualEntryPopup({ date, onCreate }: Props) {
  const { hideModal } = useModal();

  const { close } = useCurrentModal();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isChecked, setIsChecked] = useState(true);

  function checkTimeFormat(time: string) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  async function saveButton(isToTimeRequired: boolean = true) {

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }
    console.log("Required: " + isToTimeRequired)
    if (isToTimeRequired) {
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      try {
        const userid = Number(localStorage.getItem("userid"));
        if (!userid) {
          return null;
        }
        const createdTimeEntry: TimeEntry = await createTimeEntry(token, userid, new Date(date.setHours(startHours, startMinutes)), "work", new Date(date.setHours(endHours, endMinutes)));
        const entry: TimeEntry = {
          id: createdTimeEntry.id,
          userId: createdTimeEntry.userId,
          startTime: createdTimeEntry.startTime,
          endTime: createdTimeEntry.endTime,
          type: createdTimeEntry.type
        };
        onCreate(entry);
      } catch (error) {
        console.log(error)
        return null;
      }
    } else {
      try {
        const userid = Number(localStorage.getItem("userid"));
        if (!userid) {
          return null;
        }
        const createdTimeEntry: TimeEntry = await createTimeEntry(token, userid, new Date(date.setHours(startHours, startMinutes)), "work");
        const entry: TimeEntry = {
          id: createdTimeEntry.id,
          userId: createdTimeEntry.userId,
          startTime: createdTimeEntry.startTime,
          type: createdTimeEntry.type
        };
        onCreate(entry);
      } catch (error) {
        console.log(error)
        return null;
      }
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

      <br />

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

      <br />

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
          onClick={async () => {
            if (isChecked) {
              if (checkTimeFormat(startTime) && checkTimeFormat(endTime)) {
                if (startTime < endTime) {
                  await saveButton();
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