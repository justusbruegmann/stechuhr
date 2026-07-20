import {Request, Response, NextFunction} from "express";
import {authHelper} from "../utils/auth";
import {UserRole} from "../types/users";

const ROLESPERMS: Record<UserRole,number> = {user: 1, manager: 2 , admin:3};

export function authMiddleware(requiredRole: UserRole, rolesAboveAllowed: boolean = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            const id = Number(req.headers.userid);
            if (!token || !id) {
                return res.status(401).json({"error": "No token provided"});
            }
            const authUser = await authHelper(token, id);
            if (!authUser?.authorized || !authUser.data.id || !authUser.data.role) {
                return res.status(401).json({"error": "unauthorized"});
            }
            if (rolesAboveAllowed) {
                const authUserLevel = ROLESPERMS[authUser.data.role as UserRole];
                const requiredLevel = ROLESPERMS[requiredRole];
                if (authUserLevel < requiredLevel) return res.status(401).json({error: "unauthorized"});
            } else {
                if (authUser.data.role !== requiredRole) return res.status(401).json({error: "unauthorized"});
            }
            res.locals.user = {id: authUser.data.id, role: authUser.data.role};
            next();
        } catch (e) {
            return res.status(500).json({"error": "internal error"});
        }
    }
}