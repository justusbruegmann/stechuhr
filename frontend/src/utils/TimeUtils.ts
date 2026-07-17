import TimeEntry from "@/types/TimeEntry";
import {DateString} from "@/types/misc";
import Holidays from "date-holidays";

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

export function getWorkdaysInCurrentMonth(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const holidays = new Holidays('DE', 'BW');

    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
        const weekday = new Date(year, month, day);
        // 0 is Sunday in Javascript, 6 is saturday
        if (weekday.getDay() !== 0 && weekday.getDay() !== 6 && !holidays.isHoliday(weekday)) count++;
    }
    return count;
}

export function getWorkdaysInCurrentWeek(): number {
    const now = new Date();
    // Find Monday of the current week. getDay(): 0 = Sunday ... 6 = Saturday.
    // Treat Sunday (0) as day 7 so the week runs Monday–Sunday, per ISO 8601.
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (dayOfWeek - 1));
    const holidays = new Holidays('DE', 'BW');

    let count = 0;
    // Only Monday–Friday can be workdays, so iterate 5 days from Monday.
    for (let i = 0; i < 5; i++) {
        const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        if (!holidays.isHoliday(day)) count++;
    }
    return count;
}

export function isTodayWorkday(): boolean {
    const today = new Date();
    const day = today.getDay();
    if (day === 0 || day === 6) return false;

    const holidays = new Holidays('DE', 'BW');
    return !holidays.isHoliday(today);
}