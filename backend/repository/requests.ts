import { db } from '../app';
import { requests } from '../drizzle/schema';
import { eq, and, gt } from "drizzle-orm";
import Request from '../types/requests'

export async function getAllRequestsForUser(userId: number) {
    return await db.select().from(requests).where(eq(requests.userId, userId));
}

export async function getAllRequestsAManagerIsResponsibleFor(managerId: number) {
    return await db.select().from(requests).where(eq(requests.managerId, managerId))
}

export async function getSingleRequestById(id: number) {
    return await db.select().from(requests).where(eq(requests.id, id));
}

export async function createRequest(userId: number, managerId: number, type: "holiday" | "sick", startDate: string, endDate: string, remark?: string, isApproved?: boolean) {
    return await db.insert(requests).values({
        "userId": userId,
        "managerId": managerId,
        "type": type,
        "startDate": startDate,
        "endDate": endDate,
        "remark": remark,
        "isApproved": isApproved
    } as Request);
}

export async function updateRequest(requestId: number, approved: boolean | null) {
    return await db
        .update(requests)
        .set({ isApproved: approved })
        .where(eq(requests.id, requestId))
        .returning()
}