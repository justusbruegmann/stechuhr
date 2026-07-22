import { db } from '../app'
import { timeEntries, time_entry_type } from '../drizzle/schema';
import { eq, desc, gte, lte, and, lt, gt, ne, or, isNull } from "drizzle-orm";
import { DateString } from '../types/misc';

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

export async function getTimeEntries(userId: number, type?: (typeof time_entry_type.enumValues)[number], startDate?: DateString, endDate?: DateString) {
    const conditions = [eq(timeEntries.userId, userId)];
    if(type){
        conditions.push(eq(timeEntries.type, type));
    }
    if(startDate){
        conditions.push(gte(timeEntries.startTime, new Date(startDate)));
    } 
    if(endDate){
        conditions.push(lte(timeEntries.endTime, new Date(endDate)));
    }
    const result = await db.select().from(timeEntries).where(and(...conditions));
    return result;
}

export async function getSingleTimeEntry(timeEntryId: number) {
    const result = await db.select().from(timeEntries).where(eq(timeEntries.id, timeEntryId));
    return result;
}

export async function getLastTimeEntry(userId: number, type?: (typeof time_entry_type.enumValues)[number]){
    const conditions = [eq(timeEntries.userId, userId)];
    if(type){
        conditions.push(eq(timeEntries.type, type));
    }
    const result = await db.select().from(timeEntries).where(and (...conditions)).orderBy(desc(timeEntries.startTime)).limit(1);
    return result;
}

export async function getOverlappingTimeEntries(userId: number, startTime: Date, endTime?: Date, excludeId?: number) {
    const conditions = [eq(timeEntries.userId, userId), or(isNull(timeEntries.endTime), gt(timeEntries.endTime, startTime))];
    if (endTime) {
        conditions.push(lt(timeEntries.startTime, endTime));
    }
    if (excludeId) {
        conditions.push(ne(timeEntries.id, excludeId));
    }
    const result = await db.select().from(timeEntries).where(and(...conditions));
    return result;
} 

export async function deleteTimeEntry(timeEntryId: number){
    const result = await db.delete(timeEntries).where(eq(timeEntries.id, timeEntryId)).returning();
    return result[0];
}
