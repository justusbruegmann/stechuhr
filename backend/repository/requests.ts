import { db } from '../app'
import { requests } from '../drizzle/schema'
import { eq, and, gt } from "drizzle-orm";

export async function getAllRequestsForUser(userId: number) {
    return await db.select().from(requests).where(eq(requests.userId, userId));
}