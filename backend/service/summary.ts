import * as service from "../service/userManagement";

export async function generateSummary(userId: number, startTime: Date, endTime: Date): Promise<Record<string, any>> {

    const user = await service.getUserById(userId);

    return {
        information: `Hier ist eine Summary für den user ${userId} von ${startTime} bis ${endTime}`,
        timeEntries: [
            "hi",
            "asdf",
            2
        ],
        user: user,
    }
}