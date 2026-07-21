'use client';
import * as React from 'react';
import {capitalize} from "@/utils/StringUtils";
import styles from './answerRequestModal.module.css';
import {UserWithExtraFields} from "@/app/manager_view/page";
import RequestEntry from "@/components/managerView/requestEntry";
import Request from "@/types/Request";
import {updateRequest} from "@/scripts/requests";

export type AnswerRequestModalProps = {
    user: UserWithExtraFields;
    updateLocalState: (userId: number, remainingRequests: Request[]) => void;
};

export default function AnswerRequestModal({user, updateLocalState}: AnswerRequestModalProps) {
    const [loading, setLoading] = React.useState(false);


    async function answerRequest(requestId: number, isApproved: boolean) {
        if (loading) return;
        setLoading(true);

        try {
            await updateRequest(requestId, isApproved);

            // Update local state
            const remaining = user.openRequests.filter(req => req.id !== requestId);
            updateLocalState(user.id, remaining)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>{capitalize(user.username)}</h2>
            <hr className={styles.separator}/>

            {!loading &&
                <div className={styles.requestEntriesContainer}>
                    {user.openRequests.length === 0 ? (
                        <p className={styles.empty}>Keine offenen Anträge</p>
                    ) : (
                        user.openRequests.map((request, index) => (
                            <React.Fragment key={request.id}>
                                <RequestEntry
                                    request={request}
                                    answerRequest={answerRequest}
                                />

                                {index < user.openRequests.length - 1 &&
                                    <hr className={styles.separator}/>
                                }
                            </React.Fragment>
                        ))
                    )}
                </div>
            }

            {loading && (
                <p className={styles.empty}>Loading ...</p>
            )}
        </div>
    );
}