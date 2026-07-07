import {
    getNotificationList, postNotification, getNotification, patchNotification, deleteNotification
} from "../repository/notification";


export async function notificationListGet(userId: number) {
    try {
        const notificationList = await getNotificationList(userId);
        return notificationList;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function notificationPost(userId: number, date: string) {
    // ! NICHT FERTIG. 
    try {
        // ! const notification = await postNotification(userId, date);
        return {"message": "noch nicht fertig"};
    } catch (e) {
        console.error(e);
        throw e;
    }
    // ! NICHT FERTIG. 
}

export async function notificationGet(userId: number, id: number) {
    try {
        const notification = await getNotification(userId, id);
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