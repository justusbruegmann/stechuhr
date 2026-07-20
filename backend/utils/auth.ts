import {auth} from "../service/auth";


export async function authHelper(token: string, id: number,) {
    if (token && id) {
        const authUser = await auth(undefined, undefined, token, id);
        if (!authUser) {
            return {"authorized": false, "data": {"id": null, "role": null}};
        }
        if (authUser.succes) {
            return {"authorized": true, "data": {"id": id, "role": authUser.role}};
        }
        return {"authorized": false, "data": {"id": null, "role": null}}
    }
    return {"authorized": false, "data": {"id": null, "role": null}}
}

import {randomBytes} from "node:crypto";

export function generateRandomString(length: number) {
    return randomBytes(length).toString("base64").slice(0, length);
}

export function isValidPassword(password: string): boolean {
    // at least 8 chars
    // at least one uppercase
    // at least one lowercase
    // at least one number
    // at least one special character
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    return passwordRegex.test(password);
}