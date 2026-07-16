import { useCurrentModal } from "@/contexts/ModalContext";
import Button from "../layout/Button";
import styles from "./RequestPopup.module.css";
import Tabs from "../layout/Tabs";
import AbsenceForm from "./AbsenceForm";
import { useState } from "react";
import * as script from "@/scripts/requests";

type RequestPopupProps = {
  date: Date;
}

export default function RequestPopup({ date }: RequestPopupProps) {

  const { close } = useCurrentModal();

  const [type, setType] = useState<"holiday" | "sick">("holiday");
  const [startDate, setStartDate] = useState(formatDate(date));
  const [endDate, setEndDate] = useState(formatDate(date));
  const [remark, setRemark] = useState("");

  function upadateStartDate(date: string) {
    setStartDate(date);
  }

  function upadateEndDate(date: string) {
    setEndDate(date);
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
    "Urlaub": <AbsenceForm type="holiday" date={formatDate(date)} setType={setType} updateStartDate={upadateStartDate} updateEndDate={upadateEndDate} updateRemark={updateRemark} />,
    "Krankheit": <AbsenceForm type="sick" date={formatDate(date)} setType={setType} updateStartDate={upadateStartDate} updateEndDate={upadateEndDate} updateRemark={updateRemark} />
  };

  function checkDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dateString)) {
      return false;
    }

    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  async function createRequest(){
    const createdRequest = await script.createRequest(type, startDate, endDate, remark);
  }

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
            if (checkDateFormat(startDate) && checkDateFormat(endDate)) {
              if (startDate <= endDate) {
                console.log(`Type: ${type}`)
                console.log(`From: ${startDate}`)
                console.log(`To: ${endDate}`)
                console.log(`Remark: ${remark}`)
                createRequest();
                // toDo: add close() when successful and Error text when not
              } else {
                alert("Die Abwesenheit darf nicht enden bevor sie angefangen hat")
              }

            } else {
              alert("Bitte beide Daten in korrektem Format angeben")
            }

          }}
        />
      </div>
    </div>
  );
}