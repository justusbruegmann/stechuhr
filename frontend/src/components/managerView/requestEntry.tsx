import Button from "@/components/layout/Button";
import { formatDate } from "@/utils/TimeUtils";
import styles from "./requestEntry.module.css";
import Request from "@/types/Request";


type RequestEntryParams = {
    request: Request;
    answerRequest?: (requestId: number, approved: boolean) => Promise<void>;
};

export default function RequestEntry({ request, answerRequest }: RequestEntryParams) {
    return (
        <div className={styles.row}>
            <span className={styles.type}>
                {request.type === "sick" ? "Krankheit" : "Urlaub"}
            </span>

            <span className={styles.dates}>
                {formatDate(new Date(request.startDate))}
                {request.endDate !== request.startDate && " – " + formatDate(new Date(request.endDate))}
            </span>

            <p className={styles.remark}>{request.remark ?? ""}</p>

            <div className={styles.actions}>
                <Button label="Genehmigen" type="success" onClick={() => answerRequest?.(request.id, true)} />
                <Button label="Ablehnen" type="error" onClick={() => answerRequest?.(request.id, false)} />
            </div>
        </div>
    );
}