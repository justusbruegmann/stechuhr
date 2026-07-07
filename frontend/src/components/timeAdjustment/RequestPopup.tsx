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
  const [remark, setRemark] = useState("");

  function upadateFromDate(date: string) {
    setFromDate(date);
  }

  function upadateToDate(date: string) {
    setToDate(date);
  }

  function updateRemark(remark: string) {
    setRemark(remark);
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const tabs = {
    "Urlaub": <AbsenceForm type="Vacation" date={formatDate(date)} setType={setType} updateFromDate={upadateFromDate} updateToDate={upadateToDate} updateRemark={updateRemark} />,
    "Krankheit": <AbsenceForm type="Sick" date={formatDate(date)} setType={setType} updateFromDate={upadateFromDate} updateToDate={upadateToDate} updateRemark={updateRemark} />
  };

  return (
    <div className={styles["container"]}>
      <h2>Antrag erstellen</h2>

      <br />
      <Tabs tabs={tabs} />
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
          onClick={() => {
            console.log(`Type: ${type}`)
            console.log(`From: ${fromDate}`)
            console.log(`To: ${toDate}`)
            console.log(`Remark: ${remark}`)
          }}
        />
      </div>
    </div>
  );
}