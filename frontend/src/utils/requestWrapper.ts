export default async function sendRequest(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    body?: any,
    headersOverrides?: Record<string, string>, ignoreHeader: boolean = false
) {

    const token = localStorage.getItem("token");
    const loggedInUserId = localStorage.getItem("userid");
    if (!ignoreHeader && (!token || !loggedInUserId)) {
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
        response = await fetch(url, { method: method, body: bodyJson, headers: headers })
    } else {
        response = await fetch(url, { method: method, headers: headers })
    }

    const text = await response.text();

    let responseBody;
    if (text) {
        responseBody = JSON.parse(text);

    }

    if (response.ok) {
        return responseBody ?? null;
    }

    if (responseBody && typeof responseBody === "object" && "message" in responseBody) {
        throw new Error(responseBody.message);
    }
    throw new Error(response.statusText)
}