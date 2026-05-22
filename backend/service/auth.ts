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
        if (user.isotp) {
            return {"succes": false, "message": "has one time password"};
        }
        const sessionsOfUser = await getSessionsFromUser(userId);
        for (const session of sessionsOfUser) {
            if (session.token) {
                const isValid: boolean = await verifyPassword(token, session.token);
                if (isValid) {
                    return {"succes": true, "role": user.role, "message": "Authentication successfully"};
                }
            }
        }
        return {"succes": false, "role": user.role, "message": "Unauthorized"};
    } else if (password && username) {
        const user = await getUserFromUserName(username);
        if (!user || user.length === 0) {
            return {"succes": false, "message": "Invalid username"};
        }
        if (user[0].isotp) {
            return {"succes": false, "message": "user has one time password"};
        }
        if (user[0].pw) {
            const isValid: boolean = await verifyPassword(password, user[0].pw);
            if (isValid) {
                const session = await sessionCreate(user[0].id);
                return {"succes": true, "role": user[0].role, "message": "Authentication successfully", "sessionToken": session, "userId": user[0].id};
            }
        }

    } else {
        return null;
    }
}