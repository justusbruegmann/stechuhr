
const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function getNotificationList(token: string, userId: number) {
    const url = `${BASE_URL}/users/${userId}/notifications`;
    const headers = {
        "content-type": "application/json",
        "Authorization": `${token}`,
        "userid": `${userId}`
    };
    const response = await fetch(url, { method: "get", headers: headers })
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 200) {
        return await response.json();
    }
}

export async function postNotification(token: string, userId: number, date: string) {
    const url = `${BASE_URL}/notifications`;
    const headers = {
        "content-type": "application/json",
        "Authorization": `${token}`,
        "userid": `${userId}`
    };
    const body = { "date": date };
    const response = await fetch(url, { method: "post", body: JSON.stringify(body), headers: headers })
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 201) {
        return await response.json();
    }
}

export async function getNotification(token: string, userId: number, notificationId: number) {
    const url = `${BASE_URL}/notifications/${notificationId}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": `${token}`,
        "userid": `${userId}`
    };
    const response = await fetch(url, { method: "get", headers: headers })
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 200) {
        return await response.json();
    }
}

export async function patchNotification(token: string, userId: number, notificationId: number, isRead: boolean) {
    const url = `${BASE_URL}/notifications/${notificationId}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": `${token}`,
        "userid": `${userId}`
    };
    const body = { "read": isRead };
    const response = await fetch(url, { method: "PATCH", body: JSON.stringify(body), headers: headers })
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 204) {
        return 204;
    }
}

export async function deleteNotification(token: string, userId: number, notificationId: number) {
    const url = `${BASE_URL}/notifications/${notificationId}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": `${token}`,
        "userid": `${userId}`
    };
    const response = await fetch(url, { method: "delete", headers: headers })
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 204) {
        return 204;
    }
}