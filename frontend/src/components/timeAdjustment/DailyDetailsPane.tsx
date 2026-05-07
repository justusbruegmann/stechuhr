import Button from "@/components/layout/Button";
import DetailEntry from "@/components/overview/DetailEntry";
import ManualEntryPopup from "@/components/timeAdjustment/ManualEntryPopup";
import {useModal} from "@/contexts/ModalContext";
import TimeEntry from "@/types/TimeEntry";

import styles from "./DailyDetailsPane.module.css";

export default function DailyDetailsPane({date, entries, onAddEntry, deleteEntry}: {
    date: Date; entries: TimeEntry[]; onAddEntry: (entry: TimeEntry) => void; deleteEntry: (id: string) => void;
}) {
    const {showModal, hideModal} = useModal();

    function dateToString(date: Date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    return (
        <div className={styles["container"]}>
            <h2>Zeiteinträge für {dateToString(date)}</h2>
            <br/>
            <hr/>
            <br/>

            <div className={styles["container-entries-button"]}>
                <div>
                    {entries.map((element) => (
                        <DetailEntry key={element.id}
                                     timeEntry={element}
                                     deleteFunc={() => {
                            deleteEntry(element.id)
                        }}/>
                    ))}
                </div>

                <div className={styles["container-nachtragen"]}>
                    <Button
                        label="Manuell nachtragen"
                        type="accent"
                        height={3}
                        width={15}
                        onClick={() =>
                            showModal("popup",
                                <ManualEntryPopup
                                    date={date}
                                    onClose={() => hideModal()}
                                    onCreate={onAddEntry}
                                />
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}
