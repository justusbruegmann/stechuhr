import styles from "./TimeInput.module.css";

export default function TimeInput({ label, onChange, required }) {
    return (
        <div className={styles["time-input-container"]}>
            <label className={styles["time-label"]}>{label}</label>

            <div className={styles["input-wrapper"]}>
                <input
                    type="time"
                    onChange={onChange}
                    required={required}
                    className={styles["time-input"]}
                />
            </div>
        </div>
    );
}
