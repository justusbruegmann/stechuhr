import { db } from '../app'
import { timeEntries, time_entry_type } from '../drizzle/schema';

export async function createTimeEntry(userId: number, startTime: Date, endTime: Date, type: (typeof time_entry_type.enumValues) [number]) {
    const result = await db.insert(timeEntries).values({
        "userid": userId,
        "starttime": startTime,
        "endtime": endTime,
        "type": type
    });
    return result;
}

export async function getTimeEntries() {
    const result = await db.select({
        id: timeEntries.id,
        userid: timeEntries.userid,
        starttime: timeEntries.starttime,
        endtime: timeEntries.endtime,
        type: timeEntries.type,
    }).from(timeEntries)
    return result;
}