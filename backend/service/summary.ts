export function generateSummary(userId: String, startTime: Date, endTime: Date): Record<string, any> {
    startTime.toISOString();
    return {
        information: `Hier ist eine Summary für den user ${userId} von ${startTime} bis ${endTime}`,
        timeEntries: [
            "hi",
            "asdf",
            2
        ]
    }
}