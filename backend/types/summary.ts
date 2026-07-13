import {DateString} from "./misc";

/**
 * Represents a summary of a user's logged TimeEntries and (approved) requests such as sick leave and vacation days
 * within a specific time range.
 */
export default interface Summary {
    userId: number;
    startDate: DateString;
    endDate: DateString;

    vacationDaysTaken: number;
    sickDaysTaken: number;
    timeWorkedInMinutes: number;
}
