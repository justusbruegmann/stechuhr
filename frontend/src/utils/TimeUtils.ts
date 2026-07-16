import TimeEntry from "@/types/TimeEntry";
import {DateString} from "@/types/misc";

/**
 * Returns a string in the format DD.MM.YYYY
 */
export function formatDate(date: Date): string {
    return `${String(date.getDate()).padStart(2, '0')}.${
        String(date.getMonth() + 1).padStart(2, '0')}.${
        date.getFullYear()}`
}


export function formatDateTime(date: Date): string {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}


export function formatMsTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
}


export function formatDuration(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime()
    return formatMsTime(diff)
}


export function getTimeEntriesByTimespan(
    entries: Record<DateString, TimeEntry[]>,
    timespan: 'day' | 'week' | 'month'
): TimeEntry[] {
    const isInRange = (checkDateString: string) => {
        const today = todayDateString();

        switch (timespan) {
            case 'day': return checkDateString === today;
            case 'week': return startOfTheWeekDateString() <= checkDateString && checkDateString <= today;
            case 'month': return startOfTheMonthDateString() <= checkDateString && checkDateString <= today;
            default: return false;
        }
    }

    return Object.entries(entries)
        .filter(([dateString]) => isInRange(dateString))
        .flatMap(([, timeEntries]) => timeEntries);
}

export function generateDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/**
 * This strange workaround only exists because timezones are a pain in the ass(rse) and javascript Dates can not be created
 * with an explicit timezone.
 */
function dateInUTC(year: number, month: number, day: number): Date {
    return new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00.000Z`)
}

export function todayDateString() {
    const today = new Date();
    return generateDateString(dateInUTC(today.getFullYear(), today.getMonth() + 1, today.getDate()));
}

export function startOfTheWeekDateString() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = dateInUTC(today.getFullYear(), today.getMonth() + 1, today.getDate());
    startOfWeek.setDate(today.getDate() - daysToMonday);
    return generateDateString(startOfWeek);
}

export function startOfTheMonthDateString() {
    const today = new Date();
    const startOfMonth = dateInUTC(today.getFullYear(), today.getMonth() + 1, 1);
    return generateDateString(startOfMonth);
}
