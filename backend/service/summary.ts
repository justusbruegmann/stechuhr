import Summary from "../types/summary";
import {DateString} from "../types/misc";
import User from "../types/users";
import {getTimeEntriesService} from "./timeEntriesService";
import {TimeEntry} from "../types/timeEntry";


export async function generateSummary(user: User, startDate: DateString, endDate: DateString): Promise<Summary> {

    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    const timeEntriesWork: TimeEntry<"work">[] = await getTimeEntriesService(user.id, "work", startTime, endTime) as TimeEntry<"work">[];
    const timeEntriesHoliday: TimeEntry<"holiday">[] = await getTimeEntriesService(user.id, "holiday", startTime, endTime) as TimeEntry<"holiday">[];
    const timeEntriesSick: TimeEntry<"sick">[] = await getTimeEntriesService(user.id, "sick", startTime, endTime) as TimeEntry<"sick">[];

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