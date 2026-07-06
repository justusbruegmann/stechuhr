import styles from "./AbsenceForm.module.css";

type Props = {
    date: Date;
    onCreate: (entry: any) => void;
};

export default function AbsenceForm({date , onCreate}: Props) {
    return (
        <div className={styles["container"]}>
            <div className={styles["date-input-container"]}>
                <div className={styles["input-wrapper"]}>
                    <label>Von:</label>
                    <input type="date" className={styles["date-input"]} />
                    <label>Bis:</label>
                    <input type="date" className={styles["date-input"]} />
                </div>
            </div>
            <label>Bemerkung:</label>
            <textarea />
        </div>
    );
}