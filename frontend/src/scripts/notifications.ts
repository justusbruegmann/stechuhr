import sendRequest from "@/utils/requestWrapper";

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function getNotificationList(userId: number) {
    const url = `${BASE_URL}/users/${userId}/notifications`;

    return await sendRequest(
        "GET",
        url
    );
}

export async function postNotification(date: string) {
    const url = `${BASE_URL}/notifications`;

    return await sendRequest(
        "POST",
        url,
        { date }
    );
}

export async function getNotification(notificationId: number) {
    const url = `${BASE_URL}/notifications/${notificationId}`;

    return await sendRequest("GET", url);
}

export async function patchNotification(notificationId: number, isRead: boolean) {
    const url = `${BASE_URL}/notifications/${notificationId}`;

    return await sendRequest(
        "PATCH",
        url,
        { read: isRead }
    );
}

export async function deleteNotification(notificationId: number) {
    const url = `${BASE_URL}/notifications/${notificationId}`;

    return await sendRequest(
        "DELETE",
        url
    );
}