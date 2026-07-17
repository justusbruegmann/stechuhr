import User from "@/types/User";
import sendRequest from "@/utils/requestWrapper";
import Summary from "@/types/summary";
import {DateString} from "@/types/misc";


const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}


export async function getSummaryForUser(userId: number, startDate: DateString, endDate: DateString): Promise<Summary> {
    const url = `${BASE_URL}/summary?userId=${userId}&startDate=${startDate}&endDate=${endDate}`;
    return await sendRequest("GET", url);
}
