import { getUserById } from "./userManagement";
import { getTimeEntriesService } from "./timeEntriesService";
import { notificationPost } from "./notification";
import { getNotificationList } from "../repository/notification";
import Holidays from "date-holidays";


/* v Mit Hilfe von KI v */
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
/* ^ Mit Hilfe von KI ^ */


async function findLastWorkDay(userId: number, referenceDay: string) {
    const holidays = new Holidays("DE", "BW");

    let checkDay = shiftDateString(referenceDay, -1);

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
            getTimeEntriesService(userId, "sick", checkDay, nextDay)
        ]);

        if (typeof work === "string" || typeof vacation === "string" || typeof sick === "string") {
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

function calculateWorkTime(workEntries: { startTime: Date; endTime: Date | null; }[]) {
    const sortedEntries = [...workEntries].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const merged: { start: Date; end: Date; }[] = [];

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
        totalBreakMinutes += (merged[i + 1].start.getTime() - merged[i].end.getTime()) / (1000 * 60);
    }

    return {
        totalMinutesWorked,
        totalHoursWorked: totalMinutesWorked / 60,
        totalBreakMinutes
    };
}

export async function generateWorkTimeNotifications(userId: number, date: string) {
    try {
        const user = await getUserById(userId);

        if (!user)
            throw new Error("User not found");


        const existingNotifications = await getNotificationList(userId);

        const alreadyCheckedToday = existingNotifications.some(
            (n: any) => new Date(n.createdAt).toISOString().slice(0, 10) === date
        );

        if (alreadyCheckedToday) {
            return {
                message: `notifications for ${date} already exist`
            };
        }

        const result = await findLastWorkDay(userId, date);

        if (!result) {
            return {
                message: "no workday found in the last 90 days"
            };
        }

        const dayLabel = formatDateStringDE(result.day);

        const {
            totalMinutesWorked,
            totalHoursWorked,
            totalBreakMinutes
        } = calculateWorkTime(result.workEntries);

        const totalTargetHours = user.workload / 5;
        const lowerThreshold = totalTargetHours * 0.75;

        const notificationsToCreate: { type: "worktime_exceeded"; description: string; }[] = [];

        const targetHours = Math.floor(totalTargetHours);
        const targetMinutes = Math.round((totalTargetHours % 1) * 60);

        const workedHours = Math.floor(totalMinutesWorked / 60);
        const workedMinutes = Math.round(totalMinutesWorked % 60);

        if (totalHoursWorked < lowerThreshold) {
            notificationsToCreate.push({
                type: "worktime_exceeded",
                description: `Am ${dayLabel} wurden nur ${workedHours}h ${workedMinutes}min gearbeitet (Sollzeit: ${targetHours}h ${targetMinutes}min).`
            });
        }

        if (totalHoursWorked > 10) {
            notificationsToCreate.push({
                type: "worktime_exceeded",
                description: `Am ${dayLabel} wurden ${workedHours}h ${workedMinutes}min gearbeitet (Maximum: 10h).`
            });
        }

        let requiredBreakMinutes = 0;

        if (totalHoursWorked > 9) {
            requiredBreakMinutes = 45;
        } else if (totalHoursWorked > 6) {
            requiredBreakMinutes = 30;
        }

        if (
            requiredBreakMinutes > 0 &&
            totalBreakMinutes < requiredBreakMinutes
        ) {
            notificationsToCreate.push({
                type: "worktime_exceeded",
                description: `Am ${dayLabel} wurde bei ${workedHours}h ${workedMinutes}min Arbeitszeit nur ${Math.round(totalBreakMinutes)} Min. Pause gemacht (Sollzeit: ${requiredBreakMinutes} Min.).`
            });
        }

        for (const notification of notificationsToCreate) {
            await notificationPost(
                userId,
                user.managerid,
                notification.type,
                notification.description
            );
        }

        return {
            message: "created successfully"
        };
    } catch (e) {
        console.error(e);
        throw e;
    }
}