import {
    getNotificationList, postNotification, getNotification, patchNotification, deleteNotification
} from "../repository/notification";
import { generateWorkTimeNotifications } from "./GenerateWorkTimeNotification";

export async function notificationListGet(userId: number) {
    try {
        const today = new Date().toISOString().slice(0, 10);

        await generateWorkTimeNotifications(
            userId,
            today
        );

        const notificationList = await getNotificationList(userId);
        return notificationList;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function notificationPost(userId: number, managerId: number | null, type: "request" | "worktime_exceeded", description: string) {
    try {
        await postNotification(userId, managerId, type, description);

        return { message: "created successfully" };
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function notificationGet(id: number) {
    try {
        const notification = await getNotification(id);
        return notification;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
export async function notificationPatch(id: number, isRead: boolean) {
    try {
        const notification = await patchNotification(id, isRead);
        return notification;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function notificationDelete(id: number) {
    try {
        const notification = await deleteNotification(id);
        return notification;
    } catch (e) {
        console.error(e);
        throw e;
    }
}