import * as service from "../service/userManagement";
import Summary from "../types/summary";
import {DateString} from "../types/misc";

export async function generateSummary(userId: number, startDate: DateString, endDate: DateString): Promise<Summary> {

    const user = await service.getUserById(userId);

    return {
        userId: userId,
        startDate: "2026-06-01",
        endDate: "2026-06-30",

        vacationDaysTaken: 2,
        sickDaysTaken: 3,
        timeWorkedInMinutes: 1234,
    }
}