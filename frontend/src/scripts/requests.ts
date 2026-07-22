import sendRequest from "@/utils/requestWrapper";
import Request from "../types/Request";
import { DateString } from "@/types/misc";

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function getRequestsForUser(userId: number, startDate?: DateString, endDate?: DateString): Promise<Request[]> {
    const params = new URLSearchParams({
        userId: userId.toString(),
    });
    if (startDate) {
        params.append("startDate", startDate);
    }
    if (endDate) {
        params.append("endDate", endDate);
    }
    const url = `${BASE_URL}/requests?${params.toString()}`;

    try {
        return await sendRequest("GET", url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllRequestsAManagerIsResponsibleFor(): Promise<Request[]> {
    const url = `${BASE_URL}/requests/manager`;
    try {
        return await sendRequest("GET", url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getSingleRequestById(requestId: number): Promise<Request> {
    const url = `${BASE_URL}/requests/${requestId}`;
    try {
        return await sendRequest("GET", url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createRequest(type: "holiday" | "sick", startDate: string, endDate: string, remark?: string): Promise<Request> {
    const url = `${BASE_URL}/requests`;
    try {
        return await sendRequest("POST", url, {
            type: type,
            startDate: startDate,
            endDate: endDate,
            remark: remark ?? null
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateRequest(requestId: number, approved?: boolean | null): Promise<Request> {
    const url = `${BASE_URL}/requests/${requestId}`;
    try {
        return await sendRequest("PATCH", url, {
            approved: approved ?? null
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteRequest(requestId: number): Promise<Request> {
    const url = `${BASE_URL}/requests/${requestId}`;
    try {
        return await sendRequest("DELETE", url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}