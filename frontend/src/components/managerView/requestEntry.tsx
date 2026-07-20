import Button from "@/components/layout/Button";
import { formatDate } from "@/utils/TimeUtils";
import styles from "./requestEntry.module.css";
import {DateString} from "@/types/misc";

export interface Request {
    id: string;
    userId: number;
    managerId: number;
    type: "holiday" | "sick";
    startDate: DateString;
    endDate: DateString;
    remark?: string;
    isApproved?: boolean;
}

type RequestEntryParams = {
    request: Request;
    answerRequest?: (request: Request, approved: boolean) => void;
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
                <Button label="Genehmigen" type="success" onClick={() => answerRequest?.(request, true)} />
                <Button label="Ablehnen" type="error" onClick={() => answerRequest?.(request, false)} />
            </div>
        </div>
    );
}