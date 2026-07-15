
const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function loginToken(token: string, userId: string) {
    const url = `${BASE_URL}/auth`;
    const headers = {
        "Content-Type": "application/json",
        "authorization": token,
        "userid": userId
    };
    const response = await fetch(url, {method: "get", headers: headers});
    if (response.status === 200) {
        return await response.json();
    }
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 485) {
        return 485;
    }
}

export async function loginUsername(username: string, password: string) {
    const url = `${BASE_URL}/login`;
    const headers = {"content-type": "application/json"};
    const body = {"username": username.toLowerCase(), "password": password};
    const response = await fetch(url, {method: "post", body: JSON.stringify(body), headers: headers});
    if (response.status === 201) {
        return await response.json();
    }
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 485) {
        return {status: 485, response: await response.json()};
    }
}

export async function otpChange(userid: number,currentpwd: string, newpwd: string) {
    const url = `${BASE_URL}/users/otp/${userid}`;
    const body = {"currentpwd": currentpwd, "newpwd": newpwd};
    const headers = {"content-type": "application/json"};
    const response = await fetch(url, {method: "put", body: JSON.stringify(body), headers: headers});
    if (response.status === 200) {
        return await response.text();
    }
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
}

