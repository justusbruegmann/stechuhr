import { db } from '../app';
import { requests } from '../drizzle/schema';
import { eq, and, gte, lte } from "drizzle-orm";
import Request from '../types/requests'
import { DateString } from '../types/misc';

export async function getRequestsForUser(userId: number, startDate?: DateString, endDate?: DateString, type?: "holiday" | "sick"): Promise<Request[]> {
    const conditions = [eq(requests.userId, userId)]
    if (startDate) {
        conditions.push(gte(requests.endDate, startDate));
    }
    if (endDate) {
        conditions.push(lte(requests.startDate, endDate));
    }
    if (type) {
        conditions.push(eq(requests.type, type));
    }
    return await db.select().from(requests).where(and(...conditions)) as Request[];
}

export async function getAllRequestsAManagerIsResponsibleFor(managerId: number): Promise<Request[]> {
    return await db.select().from(requests).where(eq(requests.managerId, managerId)) as Request[];
}

export async function getSingleRequestById(id: number): Promise<Request[]> {
    return await db.select().from(requests).where(eq(requests.id, id)) as Request[];
}

export async function createRequest(userId: number, managerId: number, type: "holiday" | "sick", startDate: string, endDate: string, remark?: string, isApproved?: boolean): Promise<Request> {
    const [request] = await db.insert(requests).values({
        "userId": userId,
        "managerId": managerId,
        "type": type,
        "startDate": startDate,
        "endDate": endDate,
        "remark": remark,
        "isApproved": isApproved
    }).returning();

    return request;
}

export async function updateRequest(requestId: number, approved: boolean | null): Promise<Request> {
    const [request] = await db
        .update(requests)
        .set({ isApproved: approved })
        .where(eq(requests.id, requestId))
        .returning();
    return request;

}

export async function deleteRequest(requestId: number): Promise<Request> {
    const [request] = await db
        .delete(requests)
        .where(eq(requests.id, requestId))
        .returning()
    return request;
}