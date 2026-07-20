import {db} from '../app'
import {sessions} from '../drizzle/schema';
import {hashPassword} from "../utils/hashing";
import {eq, and, gt} from "drizzle-orm";

export async function createSession(userId: number, token: string) {
    let now: Date = new Date();
    now.setDate(now.getDate() + 1);
    const hashedToken = await hashPassword(token);
    const session = await db.insert(sessions).values({"userid": userId,"expiresat": now, "token": hashedToken});
    return hashedToken;
}

export async function getSessionsFromUser(userId: number,) {
    const now: Date = new Date();
    const userSessions = await db.select().from(sessions).where(and(eq(sessions.userid,userId),gt(sessions.expiresat, now)))
    return userSessions;
}

export async function deleteOldSession() {
    const now : Date = new Date();
    const deleted = await db.delete(sessions).where(gt(sessions.expiresat, now));
    return deleted;
}

export async function deleteSessionsOfUser(userId: number) {
    const deleted = await db.delete(sessions).where(eq(sessions.userid,userId));
    return deleted;
}