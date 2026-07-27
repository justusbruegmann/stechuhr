import Summary from "../types/summary";
import {DateString} from "../types/misc";
import User from "../types/users";
import {getTimeEntriesService} from "./timeEntriesService";
import {TimeEntry} from "../types/timeEntry";


export async function generateSummary(user: User, startDate: DateString, endDate: DateString): Promise<Summary> {

    const timeEntries: TimeEntry[] = await getTimeEntriesService(user.id, undefined, startDate, endDate) as TimeEntry[];
    const timeEntriesWork: TimeEntry<"work">[] = timeEntries.filter((entry) => entry.type === "work") as TimeEntry<"work">[];
    const timeEntriesHoliday: TimeEntry<"holiday">[] = timeEntries.filter((entry) => entry.type === "holiday") as TimeEntry<"holiday">[];
    const timeEntriesSick: TimeEntry<"sick">[] = timeEntries.filter((entry) => entry.type === "sick") as TimeEntry<"sick">[];

    const now = new Date();
    const timeWorkedInMinutes: number = timeEntriesWork.reduce((total: number, entry: TimeEntry): number => {
        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime || now);
        const durationInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
        return total + durationInMinutes;
    }, 0);
 
    return {
        userId: user.id,
        startDate,
        endDate,
        vacationDaysTaken: timeEntriesHoliday.length,
        sickDaysTaken: timeEntriesSick.length,
        timeWorkedInMinutes,
    }
}
