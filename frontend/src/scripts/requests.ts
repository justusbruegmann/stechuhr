import sendRequest from "@/utils/requestWrapper";
import Request from "../types/Request";

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function getAllRequestsForUser(userId: number): Promise<Request[]> {
    const url = `${BASE_URL}/requests?userId=${userId}`;
    return await sendRequest("GET", url);
}
