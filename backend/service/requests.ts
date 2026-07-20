import * as repository from "../repository/requests";
import * as userManagementService from "../service/userManagement";
import * as timeEntriesService from "../service/timeEntriesService";
import { DateString } from "../types/misc";
import { InvalidDateRangeError, RequestOverlapWithTimeEntryError, RequestOverlapWithRequestError, UnauthorizedError, NotFoundError} from "../errors/requestErrors";

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
    if(requestList.length != 1){
        throw new NotFoundError(); 
    }
    return requestList[0];
}

export async function createRequest(userId: number, type: "holiday" | "sick", startDate: DateString, endDate: DateString, remark?: string | null) {
    const user = await userManagementService.getUserById(userId);

    if(!user?.managerid) {
        throw new Error();
    }

    if(startDate > endDate) {
        throw new InvalidDateRangeError();
    }
    

    const timeEntrieList = await timeEntriesService.getTimeEntriesService(userId, undefined, startDate, endDate);

    if(timeEntrieList.length != 0) {
        throw new RequestOverlapWithTimeEntryError();
    }

    const requestList = await getRequestsForUser(userId, startDate, endDate);

    if(requestList.length != 0) {
        throw new RequestOverlapWithRequestError();
    }

    //toDo check maximum vacation days

    return await repository.createRequest(userId, user?.managerid, type, startDate, endDate, remark ?? undefined);
}

export async function updateRequest(requestId: number, requesterId: number, approved?: boolean | null) {
    const request = await getSingleRequestById(requestId);

    if(!request) {
        throw new Error();
    }

    if(request.managerId != requesterId) {
        throw new UnauthorizedError();
    }
    //toDo: delete a request as it is approved or denied and create timeentry when approved

    const requestList = await repository.updateRequest(requestId, approved ?? null);
    return requestList[0];
}

export async function deleteRequest(requestId: number, requesterId: number) {
    const request = await getSingleRequestById(requestId);

    if(!request) {
        return new Error();
    }

    if(request.userId !== requesterId && request.managerId !== requesterId) {
        throw new UnauthorizedError();
    }

    const requestList = await repository.deleteRequest(requestId);
    return requestList[0];
}