import {DateString} from "@/types/misc";

export default interface Request{
    id: string;
    userId: number,
    managerId: number,
    type: "holiday" | "sick",
    startDate: DateString,
    endDate: DateString,
    remark?: string,
    isApporved?: boolean
}