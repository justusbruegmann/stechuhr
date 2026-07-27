import * as repository from "../repository/requests";
import * as userManagementService from "../service/userManagement";
import * as timeEntriesService from "../service/timeEntriesService";
import * as notificationService from "../service/notification";
import { DateString } from "../types/misc";
import { InvalidDateRangeError, RequestOverlapWithTimeEntryError, RequestOverlapWithRequestError, UnauthorizedError, NotFoundError, NotEnoughHolidaysLeftError, UserNotFoundError, NoManagerAssignedError } from "../errors/requestErrors";
import Request from "../types/requests";
import User from "../types/users";
import Holidays from "date-holidays";

export function getRequestsForUser(userId: number, startDate?: DateString, endDate?: DateString, type?: "holiday" | "sick"): Promise<Request[]> {
    if (startDate && endDate && startDate > endDate) {
        throw new InvalidDateRangeError()
    }
    return repository.getRequestsForUser(userId, startDate, endDate, type);
}

export function getAllRequestsAManagerIsResponsibleFor(managerId: number): Promise<Request[]> {
    return repository.getAllRequestsAManagerIsResponsibleFor(managerId);
}

export async function getSingleRequestById(id: number): Promise<Request> {
    const requestList = await repository.getSingleRequestById(id);
    if (requestList.length != 1) {
        throw new NotFoundError();
    }
    return requestList[0];
}

export async function createRequest(userId: number, type: "holiday" | "sick", startDate: DateString, endDate: DateString, remark?: string | null): Promise<Request> {
    const user = await userManagementService.getUserById(userId);

    if (!user) {
        throw new UserNotFoundError();
    }

    if (!user.managerid) {
        throw new NoManagerAssignedError();
    }

    if (new Date(startDate) > new Date(endDate)) {
        throw new InvalidDateRangeError();
    }

    const timeEntryList = await timeEntriesService.getTimeEntriesService(userId, undefined, startDate, endDate);
    if (timeEntryList.length !== 0) {
        throw new RequestOverlapWithTimeEntryError();
    }

    const requestList = await getRequestsForUser(userId, startDate, endDate);

    if (requestList.length !== 0) {
        throw new RequestOverlapWithRequestError();
    }

    if (type === "holiday") {
        await validateEnoughHolidays(user, startDate, endDate);
    }
    return repository.createRequest(userId, user.managerid, type, startDate, endDate, remark ?? undefined);
}

export async function updateRequest(requestId: number, requesterId: number, approved?: boolean | null): Promise<Request | void> {
    const request = await getSingleRequestById(requestId);

    if (!request) {
        throw new Error();
    }

    if (request.managerId != requesterId) {
        throw new UnauthorizedError();
    }

    if (approved === false) {
        deleteRequest(requestId, requesterId);
        const message = getNotificationMessage(request.type, request.startDate, request.endDate, false);
        notificationService.notificationPost(request.userId, request.managerId, "request", message);
        return;
    }

    if (approved) {

        const range = getDaysInRange(request.startDate, request.endDate)
        const user = await userManagementService.getUserById(request.userId)
        if (!user) {
            throw new Error();
        }
        const averageWorktimePerDay = decimalHoursToTime(user.workload / 5);

        const startDate = parseDateString(request.startDate);

        const holidays = new Holidays('DE', 'BW');

        for (let i = 0; i < range; i++) {
            const startDateAsDate = new Date(startDate);
            startDateAsDate.setDate(startDate.getDate() + i)

            const dayOfWeek = startDateAsDate.getDay()

            if (dayOfWeek === 0 || dayOfWeek === 6 || holidays.isHoliday(startDateAsDate)) {
                continue;
            }

            startDateAsDate.setHours(8, 0, 0, 0);

            const endDateAsDate = new Date(startDateAsDate);
            endDateAsDate.setHours(
                8 + averageWorktimePerDay.hours,
                averageWorktimePerDay.minutes,
                averageWorktimePerDay.seconds,
                0
            );

            timeEntriesService.createTimeEntryService(request.userId, startDateAsDate, endDateAsDate, request.type);
        }

        const message = getNotificationMessage(request.type, request.startDate, request.endDate, true);
        notificationService.notificationPost(request.userId, request.managerId, "request", message);
        deleteRequest(requestId, requesterId);
        return;
    }
    const updatedRequest = await repository.updateRequest(requestId, approved ?? null);
    return updatedRequest;
}

export async function deleteRequest(requestId: number, requesterId: number): Promise<Request> {
    const request = await getSingleRequestById(requestId);

    if (!request) {
        throw new Error();
    }

    if (request.userId !== requesterId && request.managerId !== requesterId) {
        throw new UnauthorizedError();
    }

    const deletedRequest = await repository.deleteRequest(requestId);
    return deletedRequest;
}

async function validateEnoughHolidays(user: User, startDate: DateString, endDate: DateString): Promise<void> {
const years = getYearsBetween(startDate, endDate);

    for (const year of years) {
        const yearStart = `${year}-01-01` as DateString;
        const yearEnd = `${year}-12-31` as DateString;

        const requestStart = startDate > yearStart ? startDate : yearStart;

        const requestEnd = endDate < yearEnd ? endDate : yearEnd;

        const approvedHolidayEntries = await timeEntriesService.getTimeEntriesService(user.id, "holiday", yearStart, yearEnd);

        const pendingRequests = await getRequestsForUser(user.id, yearStart, yearEnd, "holiday");

        const usedHolidayDays = approvedHolidayEntries.length +
            pendingRequests.reduce(
                (sum, request) =>
                    sum +
                    getWorkingDaysInRange(request.startDate, request.endDate),
                0
            );

        const requestedDays = getWorkingDaysInRange(requestStart, requestEnd);

        if (user.holidays - usedHolidayDays < requestedDays) {
            throw new NotEnoughHolidaysLeftError();
        }
    }
}

function getYearsBetween(startDate: DateString, endDate: DateString): number[] {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    const years: number[] = [];

    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }

    return years;
}

function getDaysInRange(startDateString: string, endDateString: string): number {
    const start = new Date(startDateString);
    const end = new Date(endDateString);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffInDays = Math.round((end.getTime() - start.getTime()) / msPerDay);

    return diffInDays + 1;
}

function getWorkingDaysInRange(startDate: DateString, endDate: DateString): number {
    const start = parseDateString(startDate);
    const end = parseDateString(endDate);

    const holidays = new Holidays('DE', 'BW');
    let workingDays = 0;
    const current = new Date(start);

    while (current <= end) {
        const day = current.getDay();

        if (day !== 0 && day !== 6 && !holidays.isHoliday(current)) {
            workingDays++;
        }

        current.setDate(current.getDate() + 1);
    }

    return workingDays;
}

function parseDateString(date: string): Date {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function decimalHoursToTime(decimalHours: number) {
    const totalSeconds = Math.round(decimalHours * 3600);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
}

function getNotificationMessage(type: "sick" | "holiday", startDate: DateString, endDate: DateString, approved: boolean): string {
    let requestType: string = ""
    if (type === "sick") {
        requestType = "Krankheit"
    }
    if (type === "holiday") {
        requestType = "Urlaub"
    }

    let isApproved: string;
    if (approved) {
        isApproved = "genehmigt"
    } else {
        isApproved = "abgelent"
    }

    return `Dein Antrag auf ${requestType} vom ${startDate} bis zum ${endDate} wurde ${isApproved}.`
}