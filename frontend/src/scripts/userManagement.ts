import sendRequest from "@/utils/requestWrapper";
import User from "@/types/User";

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function createUser(username: string, managerId: number, role: string,workload:number,holidays:number, tokenOfAdmin: string, userIdOfAdmin: number) {
    const url = `${BASE_URL}/users`;
    const headers = {
        "content-type": "application/json",
        "Authorization": tokenOfAdmin,
        "userid": `${userIdOfAdmin}`
    };
    const body = {
        "username": username,
        "managerId": managerId,
        "role": role,
        "workload": workload,
        "holidays": holidays,
    };
    const response = await fetch(url, {method: "POST", body: JSON.stringify(body), headers: headers});
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 201) {
        return await response.text();
    }
}

export async function getUsers(token: string, userId: number) {
    const url = `${BASE_URL}/users?limit=100`;
    const headers = {
        "content-type": "application/json",
        "Authorization": `${token}`,
        "userid": `${userId}`
    };
    const response = await fetch(url, {method: "get", headers: headers})
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

export async function deleteUser(token: string, userIdOfAdmin: number, userid: number) {
    const url = `${BASE_URL}/users/${userid}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userIdOfAdmin}`
    }
    const response = await fetch(url, {method: "delete", headers: headers});
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 400) {
        return 400;
    }
    if (response.status === 200) {
        return 200;
    }
}

export async function getManagers(token: string, userId: number) {
    const url = `${BASE_URL}/users/managers`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userId}`
    }
    const response = await fetch(url, {method: "get", headers: headers});
    if (response.status === 401) {
        return 401;
    }
    if (response.status === 200) {
        return await response.json();
    }
}

export async function updateRole(userId: number, role: string, tokenOfAdmin: string, useridOfAdmin: number) {
    const url = `${BASE_URL}/users/${userId}/role`;
    const body = {
        "role": role.toLowerCase(),
    }
    return await sendRequest("PATCH", url, body)
    /*
    const headers = {
        "content-type": "application/json",
        "Authorization": tokenOfAdmin,
        "userid": `${useridOfAdmin}`
    }
    const body = {
        "role": role.toLowerCase(),
    }
    const result: Response = await fetch(url, {method: "patch", body: JSON.stringify(body), headers: headers});
    if (result.status === 204) {
        return 204;
    } else if (result.status === 401) {
        return 401
    } else {

        return 400
    }*/
}

export async function updateManager(userId: number, managerId: number, tokenOfAdmin: string, useridOfAdmin: number) {
    const url = `${BASE_URL}/users/${userId}/manager`;
    const body = {
        "managerid": managerId,
    }
    return await sendRequest("PATCH",url,body)
    /*const headers = {
        "content-type": "application/json",
        "Authorization": tokenOfAdmin,
        "userid": `${useridOfAdmin}`
    }
    const body = {
        "managerid": managerId,
    }
    const result = await fetch(url, {method: "patch", body: JSON.stringify(body), headers: headers});
    if (result.status === 204) {
        return 204;
    } else if (result.status === 401) {
        return 401
    } else {
        return 400
    }*/
}


export async function getUserById(userId: number):Promise<User> {
    const url = `${BASE_URL}/users/${userId}`;
    return await sendRequest("GET", url);
}

export async function getUsersForManager(): Promise<User[]> {
    const url = `${BASE_URL}/users/managers/users`;
    return await sendRequest("GET", url);
}

export async function updateUser(userId: number, changes: Record<string, any>): Promise<User> {
    const url = `${BASE_URL}/users/${userId}/employment`;
    return await sendRequest("PATCH", url, changes);
}
