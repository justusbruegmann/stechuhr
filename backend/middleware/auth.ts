import {Request, Response, NextFunction} from "express";
import {authHelper} from "../utils/auth";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    if (!token || !id) {
        return res.status(401).json({"error": "No token provided"});
    }
    const authUser = await authHelper(token, id, "admin")
    if (!authUser?.authorized || !authUser.data.id || !authUser.data.role) {
        return res.status(401).json({"error": "unauthorized"});
    }
    res.locals.user = { id: authUser.data.id, role: authUser.data.role };
    next();
}