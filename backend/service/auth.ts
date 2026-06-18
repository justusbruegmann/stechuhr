import {createSession, getSessionsFromUser, deleteOldSession} from "../repository/auth";
import {getUserFromUserName, getHash} from "../repository/userManagement";
import {generateRandomString} from "../utils/utils";
import {verifyPassword} from "../utils/hashing";
import {users} from "../drizzle/schema";

export async function sessionCreate(userId: number) {
    const tokenString: string = generateRandomString(32)
    const session = await createSession(userId, tokenString);
    return tokenString;
}

export async function auth(username?: string, password?: string, token?: string, userId?: number) {
    if (token && userId) {
        const user = await getHash(userId);
        if (user === 404) {
            return {"succes": false, "message": "User not found"};
        }
        if (user.isotp) {
            return {"succes": false, "message": "has one time password"};
        }
        const sessionsOfUser = await getSessionsFromUser(userId);
        for (const session of sessionsOfUser) {
            if (session.token) {
                const isValid: boolean = await verifyPassword(token, session.token);
                if (isValid) {
                    return {"succes": true, "role": user.role, "message": "Authentication successfully", "userId": userId};
                }
            }
        }
        return {"succes": false, "role": user.role, "message": "Unauthorized"};
    } else if (password && username) {
        const user = await getUserFromUserName(username);
        if (!user) {
            return {"succes": false, "message": "Invalid username"};
        }
        if (user.isotp) {
            return {"succes": false, "message": "user has one time password", "userId": user.id};
        }
        if (user.pw) {
            const isValid: boolean = await verifyPassword(password, user.pw);
            if (isValid) {
                const session = await sessionCreate(user.id);
                return {"succes": true, "role": user.role, "message": "Authentication successfully", "sessionToken": session, "userId": user.id};
            }
        }

    } else {
        return null;
    }
}