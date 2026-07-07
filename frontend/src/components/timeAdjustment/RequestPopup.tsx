import { useCurrentModal } from "@/contexts/ModalContext";
import Button from "../layout/Button";
import styles from "./RequestPopup.module.css";
import Tabs from "../layout/Tabs";
import AbsenceForm from "./AbsenceForm";
import { useState } from "react";

type Props = {
  date: Date;
  onCreate: (entry: any) => void; // Add request as a new type
}
export default function RequestPopup({ date, onCreate }: Props) {

  const { close } = useCurrentModal();

  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState(formatDate(date));
  const [toDate, setToDate] = useState(formatDate(date));

  function upadateFromDate(date: string) {
    setFromDate(date);
  }

  function upadateToDate(date: string) {
    setToDate(date);
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const tabs = {
    "Urlaub": <AbsenceForm type="Vacation" date={formatDate(date)} updateFromDate={upadateFromDate} updateToDate={upadateToDate} setType={setType} />,
    "Krankheit": <AbsenceForm type="Sick" date={formatDate(date)} updateFromDate={upadateFromDate} updateToDate={upadateToDate} setType={setType} />
  };

  return (
    <div className={styles["container"]}>
      <h2>Antrag erstellen</h2>

      <br />
      <Tabs tabs={tabs} />
      <br />


      <br />

      <div className={styles["container-popup-buttons"]}>
        <Button
          label="Abbrechen"
          type="primary"
          height={2.5}
          width={6}
          onClick={() => { close() }}
        />

        <Button
          label="Antrag erstellen"
          type="accent"
          height={2.5}
          width={9}
          //onClick={() => { onCreate({ date: date.toISOString(), type: "" }) 
          onClick={() => {
            console.log(`Type: ${type}`)
            console.log(`From: ${fromDate}`)
            console.log(`To: ${toDate}`)
          }}
        />
      </div>
    </div>
  );
}