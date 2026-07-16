import * as repository from "../repository/requests";
import * as userManagementService from "../service/userManagement";

export async function getAllRequestsForUser(userId: number) {
    return await repository.getAllRequestsForUser(userId);
}

export async function getAllRequestsAManagerIsResponsibleFor(managerId: number) {
    return await repository.getAllRequestsForUser(managerId);
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