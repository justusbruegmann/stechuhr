import styles from "./TimeInput.module.css";

type TimeInputProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    visible: boolean;
};

export default function TimeInput({ onChange, required, visible }: TimeInputProps) {
    return (
        <div className={styles["time-input-container"]} style={{ display: visible ? "block" : "none" }}>

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
