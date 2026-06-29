import { db } from '../app'
import { timeEntries, time_entry_type } from '../drizzle/schema';
import { eq } from "drizzle-orm";

export async function createTimeEntry(userId: number, startTime: Date, type: (typeof time_entry_type.enumValues) [number], endTime?: Date) {
    const result = await db.insert(timeEntries).values({
        "userid": userId,
        "starttime": startTime,
        "endtime": endTime ?? null,
        "type": type
    });
    return result;
}

export async function getTimeEntries(userid: number) {
    const result = await db.select({
        id: timeEntries.id,
        userid: timeEntries.userid,
        starttime: timeEntries.starttime,
        endtime: timeEntries.endtime,
        type: timeEntries.type,
    }).from(timeEntries).where(eq(timeEntries.userid, userid))
    return result;
}

export async function getSingleTimeEntry(timeEntryId: number) {
    const result = await db.select({
        id: timeEntries.id,
        userid: timeEntries.userid,
        starttime: timeEntries.starttime,
        endtime: timeEntries.endtime,
        type: timeEntries.type,
    }).from(timeEntries).where(eq(timeEntries.id, timeEntryId))
    return result;
}

export async function deleteTimeEntry(timeEntryId: number){
    const result = await db.delete(timeEntries).where(eq(timeEntries.id, timeEntryId))
    return result;
}