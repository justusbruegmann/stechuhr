import styles from "./TimeInput.module.css";

type TimeInputProps = {
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

export default function TimeInput({ label, onChange, required }: TimeInputProps) {
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
