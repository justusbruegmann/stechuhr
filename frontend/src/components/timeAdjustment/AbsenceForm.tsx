import { useEffect } from "react";
import styles from "./AbsenceForm.module.css";

type Props = {
    type: "holiday" | "sick";
    date: string;
    setType: (type: "holiday" | "sick") => void;
    updateStartDate: (date: string) => void;
    updateEndDate: (date: string) => void;
    updateRemark: (remark: string) => void;
};

export default function AbsenceForm({ type, date, setType, updateStartDate: updateStartDate, updateEndDate: updateEndDate, updateRemark }: Props) {

    useEffect(() => {
        setType && setType(type);
    }, [type, setType]);

    return (
        <div className={styles["container"]}>
            <div className={styles["date-input-container"]}>
                <label className={styles["labels"]}>Von:</label>
                <div className={styles["input-wrapper"]}>
                    <input type="date" className={styles["date-input"]} defaultValue={date} onChange={(e) => updateStartDate(e.target.value)} />
                </div>

                <label className={styles["labels"]}>Bis:</label>
                <div className={styles["input-wrapper"]}>
                    <input type="date" className={styles["date-input"]} defaultValue={date} onChange={(e) => updateEndDate(e.target.value)} />
                </div>

            </div>
            <label className={styles["labels"]}>Bemerkung:</label>
            <textarea className={styles["remark-input"]} maxLength={512} rows={4} placeholder="Optional" onChange={(e) => updateRemark(e.target.value)} />
        </div>
    );
}