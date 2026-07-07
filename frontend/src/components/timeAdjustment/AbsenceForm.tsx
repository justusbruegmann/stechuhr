import { useEffect } from "react";
import styles from "./AbsenceForm.module.css";

type Props = {
    type: "Vacation" | "Sick";
    date: string;
    updateFromDate: (date: string) => void;
    updateToDate: (date: string) => void;
    setType?: (type: string) => void;
};

export default function AbsenceForm({ type, date, updateFromDate, updateToDate, setType }: Props) {

    useEffect(() => {
        setType && setType(type);
    }, [type, setType]);

    return (
        <div className={styles["container"]}>
            <div className={styles["date-input-container"]}>
                <div className={styles["input-wrapper"]}>
                    <label>Von:</label>
                    <input type="date" className={styles["date-input"]} defaultValue={date} onChange={(e) => updateFromDate(e.target.value)} />
                    <label>Bis:</label>
                    <input type="date" className={styles["date-input"]} defaultValue={date} onChange={(e) => updateToDate(e.target.value)} />
                </div>
            </div>
            <label>Bemerkung:</label>
            <textarea />
        </div>
    );
}