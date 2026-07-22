import * as repository from "../repository/requests";
import * as userManagementService from "../service/userManagement";
import * as timeEntriesService from "../service/timeEntriesService";
import * as summaryService from "../service/summary";
import { DateString } from "../types/misc";
import { InvalidDateRangeError, RequestOverlapWithTimeEntryError, RequestOverlapWithRequestError, UnauthorizedError, NotFoundError, NotEnoughHolidaysLeft } from "../errors/requestErrors";

export async function getRequestsForUser(userId: number, startDate?: DateString, endDate?: DateString) {
    if (startDate && endDate && startDate > endDate) {
        throw new InvalidDateRangeError()
    }
    return await repository.getRequestsForUser(userId, startDate, endDate);
}

export async function getAllRequestsAManagerIsResponsibleFor(managerId: number) {
    return await repository.getAllRequestsAManagerIsResponsibleFor(managerId);
}

export async function getSingleRequestById(id: number) {
    const requestList = await repository.getSingleRequestById(id);
    if (requestList.length != 1) {
        throw new NotFoundError();
    }
    return requestList[0];
}

export async function createRequest(userId: number, type: "holiday" | "sick", startDate: DateString, endDate: DateString, remark?: string | null) {
    const user = await userManagementService.getUserById(userId);

    if (!user?.managerid) {
        throw new Error();
    }

    if (startDate > endDate) {
        throw new InvalidDateRangeError();
    }


    const timeEntrieList = await timeEntriesService.getTimeEntriesService(userId, undefined, startDate, endDate);

    if (timeEntrieList.length != 0) {
        throw new RequestOverlapWithTimeEntryError();
    }

    const requestList = await getRequestsForUser(userId, startDate, endDate);

    if (requestList.length != 0) {
        throw new RequestOverlapWithRequestError();
    }

    if (type === "holiday") {
        const holidays = user.holidays;
        const summaryStartDate = `${new Date().getFullYear}-01-01`;
        const summaryEndDate = `${new Date().getFullYear}-12-31`;
        const takenHolidays = (await summaryService.generateSummary(user, summaryStartDate, summaryEndDate)).vacationDaysTaken;

        if ((holidays - takenHolidays) < getDaysInRange(startDate, endDate)) {
            throw new NotEnoughHolidaysLeft();
        }
    }

    return await repository.createRequest(userId, user?.managerid, type, startDate, endDate, remark ?? undefined);
}

export async function updateRequest(requestId: number, requesterId: number, approved?: boolean | null) {
    const request = await getSingleRequestById(requestId);

    if (!request) {
        throw new Error();
    }

    if (request.managerId != requesterId) {
        throw new UnauthorizedError();
    }

    if (approved === false) {
        deleteRequest(requestId, requesterId);
        //Generiere eine notification
        return;
    }

    if (approved) {
        const startDate = new Date(request.startDate);
        const range = getDaysInRange(request.startDate, request.endDate)
        const user = await userManagementService.getUserById(request.userId)
        if (!user) {
            throw new Error();
        }
        const averageWorktimePerDay = decimalHoursToTime(user.workload);

        for (let i = 0; i <= range; i++) {
            const startDateAsDate = startDate;
            const endDateAsDate = startDate;
            startDateAsDate.setDate(startDate.getDate() + i);
            startDateAsDate.setHours(8);
            endDateAsDate.setDate(startDate.getDate() + i);
            startDateAsDate.setHours(8 + averageWorktimePerDay.hours, averageWorktimePerDay.minutes, averageWorktimePerDay.seconds);
            await timeEntriesService.createTimeEntryService(request.userId, startDateAsDate, endDateAsDate, request.type)
        }
        deleteRequest(requestId, requesterId);
        return;
    }
    const requestList = await repository.updateRequest(requestId, approved ?? null);
    return requestList[0];
}

export async function deleteRequest(requestId: number, requesterId: number) {
    const request = await getSingleRequestById(requestId);

    if (!request) {
        return new Error();
    }

    if (request.userId !== requesterId && request.managerId !== requesterId) {
        throw new UnauthorizedError();
    }

    const requestList = await repository.deleteRequest(requestId);
    return requestList[0];
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

function decimalHoursToTime(decimalHours: number) {
    const totalSeconds = Math.round(decimalHours * 3600);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
}