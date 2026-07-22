export type TimeEntryType = "work" | "holiday" | "sick";

export interface TimeEntry<T = string> {
    id: number;
    userId: number | null;
    startTime: Date;
    endTime: Date | null;
    type: T;
}