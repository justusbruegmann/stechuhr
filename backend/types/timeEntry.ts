export type TimeEntryType = "work" | "holiday" | "sick";

export interface TimeEntry<T = string> {
    id: number;
    userId?: number;
    startTime: Date;
    endTime?: Date;
    type: T;
}