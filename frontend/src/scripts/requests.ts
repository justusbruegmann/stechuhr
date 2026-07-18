import sendRequest from "@/utils/requestWrapper";
import Request from "../types/Request";

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function getAllRequestsForUser(userId: number) {
    const url = `${BASE_URL}/requests?userId=${userId}`;
    try {
        return await sendRequest("GET", url);
    } catch (error) {
        console.log(error);
    }
}

export async function getAllRequestsAManagerIsResponsibleFor(managerId: number) {
    const url = `${BASE_URL}/requests/manager/${managerId}`;
    try {
        return await sendRequest("GET", url);
    } catch (error) {
        console.log(error);
    }
}

export async function getSingleRequestById(requestId: number) {
    const url = `${BASE_URL}/requests/${requestId}`;
    try {
        return await sendRequest("GET", url);
    } catch (error) {
        console.log(error);
    }
}

export async function createRequest(type: "holiday" | "sick", startDate: string, endDate: string, remark?: string) {
    const url = `${BASE_URL}/requests?type=${type}&startDate=${startDate}&endDate=${endDate}&remark=${remark}`;
    try {
        return await sendRequest("POST", url);
    } catch (error) {
        console.log(error);
    }
}