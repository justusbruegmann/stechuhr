import { db } from '../app'
import { notifications } from '../drizzle/schema';
import { eq, and } from "drizzle-orm";


export async function getNotificationList(userId: number) {
    const result = await db.select({
        id: notifications.id,
        userid: notifications.userId,
        managerid: notifications.managerId,
        type: notifications.type,
        description: notifications.description,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
    }).from(notifications).where(eq(notifications.userId, userId))
    return result;
}

export async function postNotification(userId: number, managerId: number, type: "info" | "warning", description: string) {
    const result = await db.insert(notifications).values({
        "userId": userId,
        "managerId": managerId,
        "type": type,
        "description": description,
    })
    return result;
}

export async function getNotification(userId: number, id: number) {
    const result = await db.select().from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.id, id)))
    return result;
}

export async function patchNotification(id: number, isRead: boolean) {
    const result = await db.update(notifications).set({ "isRead": isRead }).where(eq(notifications.id, id))
    return result;
}

export async function deleteNotification(notificationId: number) {
    const result = await db.delete(notifications).where(eq(notifications.id, notificationId))
    return result;
}