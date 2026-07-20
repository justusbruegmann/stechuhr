'use client';
import * as React from 'react';
import User from "@/types/User";
import { capitalize } from "@/utils/StringUtils";
import styles from './answerRequestModal.module.css';
import { useCurrentModal } from "@/contexts/ModalContext";
import { UserWithExtraFields } from "@/app/manager_view/page";
import RequestEntry from "@/components/managerView/requestEntry";
import Request from "@/types/Request";

export type AnswerRequestModalProps = {
    user: UserWithExtraFields;
    updateLocalState?: (newEntries: Partial<Record<keyof User, any>>) => void; // ToDo: Change this
};

export default function AnswerRequestModal({ user, updateLocalState }: AnswerRequestModalProps) {
    const { close } = useCurrentModal();
    const [requests, setRequests] = React.useState<Request[]>(user.openRequests);
    const [busy, setBusy] = React.useState(false);

    async function answerRequest(request: Request, approved: boolean) {
        if (busy) return;
        setBusy(true);
        try {
            // ToDo: persistence

            const remaining = requests.filter(r => r.id !== request.id);
            setRequests(remaining);
            if (remaining.length === 0) close();
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>{capitalize(user.username)}</h2>
            <hr className={styles.separator} />

            {requests.length === 0 ? (
                <p className={styles.empty}>Keine offenen Anträge</p>
            ) : (
                requests.map((request, index) => (
                    <>
                        <RequestEntry
                            request={request}
                            answerRequest={answerRequest}
                        />

                        {index < requests.length - 1 &&
                            <hr className={styles.separator} />
                        }

                    </>
                ))
            )}
        </div>
    );
}