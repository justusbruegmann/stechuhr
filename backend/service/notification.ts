import {
    getNotificationList, postNotification, getNotification, patchNotification, deleteNotification
} from "../repository/notification";
import { getUserById } from "../repository/userManagement";
import { getTimeEntries } from "../repository/timeEntriesRepository";
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
export async function notificationPost(userId: number, date: string) {
    try {
        // ! NOCH NICHT FERTIG, REQUESTS FEHLEN NOCH
        const user = await getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const existingNotifications = await getNotificationList(userId);
        const referenceDate = new Date(date);
        const checkDay = new Date(referenceDate);
        checkDay.setDate(checkDay.getDate() - 1);

        const alreadyCheckedToday = existingNotifications.some(
            (n: any) => new Date(n.createdAt).toDateString() === referenceDate.toDateString()
        );

        if (alreadyCheckedToday)
            return { message: `notifications for ${referenceDate.toDateString()} already exist` };

        const holidays = new Holidays("DE", "BW");

        let workEntries: Awaited<ReturnType<typeof getTimeEntries>> = [];
        let foundWorkDay = false;

        const maxLookback = 90;
        let iterations = 0;

        while (iterations < maxLookback) {
            iterations++;

            const dayOfWeek = checkDay.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const holidayResult = holidays.isHoliday(checkDay);
            const isPublicHoliday = holidayResult && holidayResult.some(h => h.type === "public");

            if (isWeekend || isPublicHoliday) {
                checkDay.setDate(checkDay.getDate() - 1);
                continue;
            }

            const dayStart = new Date(checkDay);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(checkDay);
            dayEnd.setHours(23, 59, 59, 999);


            const dayStartStr = dayStart.toISOString();
            const dayEndStr = dayEnd.toISOString();

            const [work, vacation, sick] = await Promise.all([
                getTimeEntries(userId, "work", dayStartStr, dayEndStr),
                getTimeEntries(userId, "holiday", dayStartStr, dayEndStr),
                getTimeEntries(userId, "sick", dayStartStr, dayEndStr),
            ]);

            if (work.length > 0) {
                workEntries = work;
                foundWorkDay = true;
                break;
            }

            if (vacation.length > 0 || sick.length > 0) {
                checkDay.setDate(checkDay.getDate() - 1);
                continue;
            }

            break;
        }

        if (!foundWorkDay)
            return { message: "no workday found in the last 90 days" };

        const dayLabel = checkDay.toLocaleDateString("de-DE");

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
        const totalHoursWorked = totalMinutesWorked / 60;

        let totalBreakMinutes = 0;
        for (let i = 0; i < merged.length - 1; i++) {
            totalBreakMinutes +=
                (merged[i + 1].start.getTime() - merged[i].end.getTime()) / (1000 * 60);
        }

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

export async function notificationGet(userId: number, id: number) {
    try {
        const notification = await getNotification(userId, id);
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