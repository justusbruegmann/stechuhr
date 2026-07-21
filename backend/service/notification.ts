import {
    getNotificationList, postNotification, getNotification, patchNotification, deleteNotification
} from "../repository/notification";
import { getUserById } from "../service/userManagement";
import { getTimeEntriesService } from "../service/timeEntriesService";
import Holidays from "date-holidays";


export async function notificationListGet(userId: number) {
    try {
        const notificationList = await getNotificationList(userId);
        return notificationList;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

// ! NOCH NICHT FERTIG, REQUESTS FEHLEN NOCH
function dateStringToUTCDate(dateString: string): Date {
    return new Date(`${dateString}T00:00:00.000Z`);
}

function shiftDateString(dateString: string, days: number): string {
    const date = dateStringToUTCDate(dateString);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

function formatDateStringDE(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}

async function findLastWorkDay(userId: number, referenceDay: string) {
    const holidays = new Holidays("DE", "BW");

    let checkDay = shiftDateString(referenceDay, -1);
    let workEntries: {
        startTime: Date;
        endTime: Date | null;
    }[] = [];

    const maxLookback = 90;
    let iterations = 0;

    while (iterations < maxLookback) {
        iterations++;

        const weekday = dateStringToUTCDate(checkDay).getUTCDay();
        const isWeekend = weekday === 0 || weekday === 6;

        const holidayResult = holidays.isHoliday(dateStringToUTCDate(checkDay));
        const isPublicHoliday =
            holidayResult && holidayResult.some(h => h.type === "public");

        if (isWeekend || isPublicHoliday) {
            checkDay = shiftDateString(checkDay, -1);
            continue;
        }

        const nextDay = shiftDateString(checkDay, 1);

        const [work, vacation, sick] = await Promise.all([
            getTimeEntriesService(userId, "work", checkDay, nextDay),
            getTimeEntriesService(userId, "holiday", checkDay, nextDay),
            getTimeEntriesService(userId, "sick", checkDay, nextDay),
        ]);

        if (
            typeof work === "string" ||
            typeof vacation === "string" ||
            typeof sick === "string"
        ) {
            throw new Error("Failed to load time entries");
        }

        if (work.length > 0) {
            return {
                day: checkDay,
                workEntries: work
            };
        }

        if (vacation.length > 0 || sick.length > 0) {
            checkDay = shiftDateString(checkDay, -1);
            continue;
        }

        break;
    }

    return null;
}

function calculateWorkTime(workEntries: {
    startTime: Date;
    endTime: Date | null;
}[]) {
    const sortedEntries = [...workEntries].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const merged: { start: Date; end: Date }[] = [];

    for (const entry of sortedEntries) {
        if (!entry.endTime) continue;

        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime);

        if (merged.length === 0) {
            merged.push({ start, end });
            continue;
        }

        const last = merged[merged.length - 1];

        if (start <= last.end) {
            if (end > last.end) {
                last.end = end;
            }
        } else {
            merged.push({ start, end });
        }
    }

    let totalMinutesWorked = 0;
    for (const interval of merged) {
        totalMinutesWorked +=
            (interval.end.getTime() - interval.start.getTime()) / (1000 * 60);
    }

    let totalBreakMinutes = 0;
    for (let i = 0; i < merged.length - 1; i++) {
        totalBreakMinutes +=
            (merged[i + 1].start.getTime() - merged[i].end.getTime()) / (1000 * 60);
    }

    return {
        totalMinutesWorked,
        totalHoursWorked: totalMinutesWorked / 60,
        totalBreakMinutes,
    };
}

export async function notificationPost(userId: number, date: string) {
    try {
        const user = await getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const existingNotifications = await getNotificationList(userId);
        const referenceDay = date;

        const alreadyCheckedToday = existingNotifications.some(
            (n: any) => new Date(n.createdAt).toISOString().slice(0, 10) === referenceDay
        );

        if (alreadyCheckedToday)
            return { message: `notifications for ${referenceDay} already exist` };

        const result = await findLastWorkDay(userId, referenceDay);

        if (!result) {
            return { message: "no workday found in the last 90 days" };
        }

        const checkDay = result.day;
        const workEntries = result.workEntries;

        const dayLabel = formatDateStringDE(checkDay);

        const {
            totalMinutesWorked,
            totalHoursWorked,
            totalBreakMinutes,
        } = calculateWorkTime(workEntries);

        const targetHours = user.workload / 5;
        const lowerThreshold = targetHours * 0.75;

        const notificationsToCreate: { type: "worktime_exceeded"; description: string }[] = [];

        const hours = Math.floor(totalMinutesWorked / 60);
        const minutes = Math.round(totalMinutesWorked % 60);

        if (totalHoursWorked < lowerThreshold) {
            notificationsToCreate.push({
                type: "worktime_exceeded",
                description: `Am ${dayLabel} wurden nur ${hours}h ${minutes}min gearbeitet (Soll: mind. ${hours}h ${minutes}min).`
            });
        }

        if (totalHoursWorked > 10) {
            notificationsToCreate.push({
                type: "worktime_exceeded",
                description: `Am ${dayLabel} wurden ${hours}h ${minutes}min gearbeitet (gesetzliches Maximum: 10h).`
            });
        }

        let requiredBreakMinutes = 0;
        if (totalHoursWorked > 9) {
            requiredBreakMinutes = 45;
        } else if (totalHoursWorked > 6) {
            requiredBreakMinutes = 30;
        }

        if (requiredBreakMinutes > 0 && totalBreakMinutes < requiredBreakMinutes) {
            notificationsToCreate.push({
                type: "worktime_exceeded",
                description: `Am ${dayLabel} wurde bei ${hours}h ${minutes}min Arbeitszeit nur ${Math.round(totalBreakMinutes)} Min. Pause gemacht (erforderlich: ${requiredBreakMinutes} Min.).`
            });
        }

        for (const n of notificationsToCreate) {
            await postNotification(userId, user.managerid, n.type, n.description);
        }

        return { message: "created successfully" };
    } catch (e) {
        console.error(e);
        throw e;
    }
}
// ! NOCH NICHT FERTIG, REQUESTS FEHLEN NOCH

export async function notificationGet(id: number) {
    try {
        const notification = await getNotification(id);
        return notification;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
export async function notificationPatch(id: number, isRead: boolean) {
    try {
        const notification = await patchNotification(id, isRead);
        return notification;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function notificationDelete(id: number) {
    try {
        const notification = await deleteNotification(id);
        return notification;
    } catch (e) {
        console.error(e);
        throw e;
    }
}