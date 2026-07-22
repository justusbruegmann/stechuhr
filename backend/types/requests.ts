import { DateString } from "./misc";

export default interface Request{
    userId: number,
    managerId: number,
    type: "holiday" | "sick",
    startDate: DateString,
    endDate: DateString,
    remark?: string,
    isApproved?: boolean
}