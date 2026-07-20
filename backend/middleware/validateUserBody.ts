import {Request, Response, NextFunction} from "express";

export function validateBody(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    if (!body) {
        return res.status(400).send("invalid body");
    }
    if (!body.username || typeof body.username !== "string" || body.username.trim() === "") {
        return res.status(400).json({error: "Username is required"});
    }
    if (body.username.length > 64) {
        return res.status(400).json({error: "Username must be 64 characters or less"});
    }

    const validRoles = ["admin", "manager", "user"];
    if (!body.role || !validRoles.includes(body.role)) {
        return res.status(400).json({error: "Invalid role"});
    }

    if (body.managerId !== undefined && body.managerId !== null) {
        if (!Number.isInteger(body.managerId) || body.managerId < 1) {
            return res.status(400).json({error: "managerId must be a positive integer"});
        }
    }

    if (body.workload !== undefined) {
        if (!Number.isInteger(body.workload) || body.workload < 0 || body.workload > 178) {
            return res.status(400).json({error: "Workload must be an integer between 0 and 178"});
        }
    }

    if (body.holidays !== undefined) {
        if (!Number.isInteger(body.holidays) || body.holidays < 0 || body.holidays > 365) {
            return res.status(400).json({error: "Holidays must be an integer between 0 and 365"});
        }
    }
    next()
}