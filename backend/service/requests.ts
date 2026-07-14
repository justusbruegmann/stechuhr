import * as repository from "../repository/requests";


export async function getAllRequestsForUser(userId: number){
    return await repository.getAllRequestsForUser(userId);
}