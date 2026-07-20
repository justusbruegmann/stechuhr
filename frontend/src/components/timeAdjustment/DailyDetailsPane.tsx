import Button from "@/components/layout/Button";
import DetailEntry from "@/components/overview/DetailEntry";
import ManualEntryPopup from "@/components/timeAdjustment/ManualEntryPopup";
import {useModal} from "@/contexts/ModalContext";
import TimeEntry from "@/types/TimeEntry";

import styles from "./DailyDetailsPane.module.css";
import RequestPopup from "./RequestPopup";
import {DateString} from "@/types/misc";
import {formatDate, generateDateString} from "@/utils/TimeUtils";

export default function DailyDetailsPane({
                                             date,
                                             entries,
                                             onAddEntry,
                                             deleteEntry
}: {
    date: DateString;
    entries: TimeEntry[];
    onAddEntry: (entry: TimeEntry) => void;
    deleteEntry: (id: number) => void;
}) {
    const {showModal, hideModal} = useModal();

    return (
        <div className={styles["container"]}>
            <h2>Zeiteinträge für {formatDate(new Date(date))}</h2>
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
                        width={10}
                        onClick={() =>
                            showModal("popup",
                                <ManualEntryPopup
                                    date={new Date(date)}
                                    onCreate={onAddEntry}
                                />
                            )
                        }
                    />
                    <Button
                        label="Antrag erstellen"
                        type="primary"
                        height={3}
                        width={10}
                        onClick={() =>
                            showModal("popup",
                                <RequestPopup date={new Date(date)}/>
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}
