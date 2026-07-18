import * as repository from "../repository/requests";
import * as userManagementService from "../service/userManagement";

export async function getAllRequestsForUser(userId: number) {
    return await repository.getAllRequestsForUser(userId);
}

export async function getAllRequestsAManagerIsResponsibleFor(managerId: number) {
    return await repository.getAllRequestsAManagerIsResponsibleFor(managerId);
}

export async function getSingleRequestById(id: number) {
    const requestList = await repository.getSingleRequestById(id);
    if(requestList.length == 1) {
        return requestList[0];
    } else {
        return null;
    }
}

export async function createRequest(userId: number, type: "holiday" | "sick", startDate: string, endDate: string, remark?: string) {
    const user = await userManagementService.getUserById(userId);

    //toDo: add Validation 
    
    if (user?.managerid != null && user?.managerid != undefined && (startDate <= endDate)) {
        return await repository.createRequest(userId, user?.managerid, type, startDate, endDate, remark);
    } else {
        throw new Error("Server Error");
    }
}

export async function updateRequest(requestId: number, approved?: boolean) {
    //toDo: Validation
    return await repository.updateRequest(requestId, approved);
}
