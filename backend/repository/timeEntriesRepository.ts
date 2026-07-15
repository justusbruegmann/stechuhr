import { db } from '../app'
import { timeEntries, time_entry_type } from '../drizzle/schema';
import { eq, desc, gte, lte, and } from "drizzle-orm";

export async function createTimeEntry(userId: number, startTime: Date, type: (typeof time_entry_type.enumValues) [number], endTime?: Date) {
    const result = await db.insert(timeEntries).values({
        "userId": userId,
        "startTime": startTime,
        "endTime": endTime ?? null,
        "type": type
    }).returning();
    return result[0];
}

export async function setEndTime(timeEntryId: number, endTime: Date) {
    const result = await db.update(timeEntries).set({"endTime": endTime}).where(eq(timeEntries.id, timeEntryId)).returning();
    return result[0];
}

export async function getTimeEntries(userId: number, type?: string, startDate?: Date, endDate?: Date) {
    const conditions = [eq(timeEntries.userId, userId)];
    if(type){
        conditions.push(eq(timeEntries.type, type as "work" | "holiday" | "sick"));
    }
    if(startDate){
        conditions.push(gte(timeEntries.startTime, startDate));
    } 
    if(endDate){
        conditions.push(lte(timeEntries.endTime, endDate));
    }
    const result = await db.select({
        id: timeEntries.id,
        userId: timeEntries.userId,
        startTime: timeEntries.startTime,
        endTime: timeEntries.endTime,
        type: timeEntries.type,
    }).from(timeEntries).where(and(...conditions));
    return result;
}

export async function getSingleTimeEntry(timeEntryId: number) {
    const result = await db.select({
        id: timeEntries.id,
        userId: timeEntries.userId,
        startTime: timeEntries.startTime,
        endTime: timeEntries.endTime,
        type: timeEntries.type,
    }).from(timeEntries).where(eq(timeEntries.id, timeEntryId));
    return result;
}

export async function getLastTimeEntry(userId: number){
    const result = await db.select({
        id: timeEntries.id,
        userId: timeEntries.userId,
        startTime: timeEntries.startTime,
        endTime: timeEntries.endTime,
        type: timeEntries.type,
    }).from(timeEntries).where(eq(timeEntries.userId, userId)).orderBy(desc(timeEntries.startTime)).limit(1);
    return result;
}

export async function deleteTimeEntry(timeEntryId: number){
    const result = await db.delete(timeEntries).where(eq(timeEntries.id, timeEntryId));
    return result;
}