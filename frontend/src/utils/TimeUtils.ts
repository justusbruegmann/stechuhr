import {TimeEntry} from "@/types/TimeEntry";

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
    entries: Record<string, TimeEntry[]>,
    timespan: 'day' | 'week' | 'month'
): TimeEntry[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const isInRange = (dateString: string): boolean => {
        const date = new Date(dateString);
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        switch (timespan) {
            case 'day':
                return checkDate.getTime() === today.getTime();

            case 'week': {
                const dayOfWeek = today.getDay();
                // Convert Sunday (0) to 6, so Monday is the start of the week instead of the predefined sunday = 0
                const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - daysToMonday);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);

                return checkDate.getTime() >= startOfWeek.getTime() &&
                    checkDate.getTime() <= endOfWeek.getTime();
            }

            case 'month':
                return checkDate.getFullYear() === today.getFullYear() &&
                    checkDate.getMonth() === today.getMonth();
        }
    };

    return Object.entries(entries)
        .filter(([dateString]) => isInRange(dateString))
        .flatMap(([, timeEntries]) => timeEntries);
}

function generateDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/**
 * This strange workaround only exists because timezones are a pain in the arse and javascript Dates can not be created
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