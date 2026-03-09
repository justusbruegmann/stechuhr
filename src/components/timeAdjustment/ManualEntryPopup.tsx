"use client";

import { useRef, useState } from "react";
import TimeInput from "@/components/timeAdjustment/TimeInput";
import Button from "@/components/layout/Button";
import { useModal } from "@/contexts/ModalContext";
import TimeEntry from "@/types/TimeEntry";
import styles from "./ManualEntryPopup.module.css";

type Props = {
  date: Date;
  onClose: () => void;
  onCreate: (entry: TimeEntry) => void;
};

export default function ManualEntryPopup({ date, onClose, onCreate }: Props) {
  const { hideModal } = useModal();

  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  function saveButton() {
    const [fromHours, fromMinutes] = fromTime.split(":").map(Number);
    const [toHours, toMinutes] = toTime.split(":").map(Number);

    const entry: TimeEntry = {
      id: crypto.randomUUID(),
      userId: "456",
      startTime: new Date(date.setHours(fromHours, fromMinutes)).toISOString(),
      endTime: new Date(date.setHours(toHours, toMinutes)).toISOString(),
    };

    console.log("Created entry:", entry);

    onCreate(entry);
  }

  return (
    <div>
      <h2>Manueller Zeiteintrag</h2>

      <br />

      <TimeInput
        label="Einstempelzeit"
        onChange={(e) => setFromTime(e.target.value)}
        required
      />

      <br />

      <TimeInput
        label="Ausstempelzeit"
        onChange={(e) => setToTime(e.target.value)}
        required
      />

      <br />

      <div className={styles["container-popup-buttons"]}>
        <Button
          label="Abbrechen"
          type="primary"
          height={2.5}
          width={6}
          onClick={() => {onClose}}
        />

        <Button
          label="Eintrag hinzufügen"
          type="accent"
          height={2.5}
          width={9}
          onClick={() => {
            saveButton();
            onClose();
          }}
        />
      </div>
    </div>
  );
}