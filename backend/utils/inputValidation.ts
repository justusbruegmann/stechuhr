import {z} from "zod";


export function isValidUserId(userId: any) {
    const userIdSchema = z.coerce.number().int().positive();

    try {
        userIdSchema.parse(userId);
        return true;
    } catch (e) {
        return false;
    }
}