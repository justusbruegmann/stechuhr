import { DateString } from "./misc";

export default interface Request{
    userId: number,
    managerId: number | null,
    type: "holiday" | "sick",
    startDate: DateString,
    endDate: DateString,
    remark?: string | null,
    isApproved?: boolean | null
}