export default async function sendRequest(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    body?: any,
    headersOverrides?: Record<string, string>
) {

    const token = localStorage.getItem("token");
    const loggedInUserId = localStorage.getItem("userid");
    if (!token || !loggedInUserId) {
        throw new Error("token or userid not found in local storage");
    }

    const headersPreset = {
        "content-type": "application/json",
        "Authorization": `${token}`,
        "userid": `${loggedInUserId}`
    }

    const headers = {
        ...headersPreset,
        ...headersOverrides
    }

    let response;
    if (body !== undefined && body !== null) {
        const bodyJson = JSON.stringify(body)
        response = await fetch(url, {method: method, body: bodyJson, headers: headers})
    } else {
        response = await fetch(url, {method: method, headers: headers})
    }

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}