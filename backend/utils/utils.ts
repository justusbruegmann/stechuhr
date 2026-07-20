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