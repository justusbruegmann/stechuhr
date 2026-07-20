'use client';
import * as React from 'react';
import User from "@/types/User";
import {capitalize} from "@/utils/StringUtils";
import styles from './answerRequestModal.module.css';
import Button from "@/components/layout/Button";
import {useCurrentModal} from "@/contexts/ModalContext";
import {UserWithExtraFields} from "@/app/manager_view/page";
import {formatDate} from "@/utils/TimeUtils";


export type AnswerRequestModalProps = {
    user: UserWithExtraFields;
    updateLocalState?: (newEntries: Partial<Record<keyof User, any>>) => void; //ToDo: Change this
}

export default function AnswerRequestModal({user, updateLocalState}: AnswerRequestModalProps) {

    const {close} = useCurrentModal()

    const [loading, setLoading] = React.useState(false);

    async function save() {
        //
        // const updates = {
        //     holidays: Number((document.getElementById("vacationDays") as HTMLInputElement).value),
        //     workload: Number((document.getElementById("workload") as HTMLInputElement).value)
        // }
        //
        // if (updates.holidays == userState?.holidays && updates.workload == userState?.workload) {
        //     setLoading(false);
        //     close();
        //     return
        // }
        //
        // setLoading(true);
        //
        // await updateUser(userId, updates)
        //     .then(_ => {
        //
        //         if (updateLocalState) {
        //             updateLocalState(updates);
        //         }
        //     })
        //     .catch(e => {
        //         console.error(e);
        //     })

        setLoading(false);
        close();
    }


    return <>
        {
            loading &&
            <div className="loading">Loading ...</div>
        }
        {!loading &&
            <div className={styles.container}>
                <h2 className={styles.header}>
                    {capitalize(user.username)}
                </h2>

                <hr className={styles.separator}/>

                {user.openRequests.map((request) =>
                    <div className={styles.row}>
                        <p><b>Antrag {request.type === "sick" ? "Krankheit" : "Urlaub"}</b></p>
                        <p>
                            <b>{formatDate(new Date(request.startDate))}{request.endDate !== request.startDate ? " – " + formatDate(new Date(request.endDate)) : ""}</b>
                        </p>
                        <p>{request?.remark}</p>
                        <Button label={"Antrag genehmigen"} type={"success"}
                                onClick={() => alert("Antrag genehmigt!")}/>
                        <Button label={"Antrag ablehnen"} type={"error"} onClick={() => alert("Antrag abgelehnt!")}/>
                    </div>
                )}
            </div>
        }
    </>
}