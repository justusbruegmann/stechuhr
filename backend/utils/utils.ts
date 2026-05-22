import {randomBytes} from "node:crypto";

export function generateRandomString(length: number) {
    return randomBytes(length).toString("base64").slice(0, length);
}