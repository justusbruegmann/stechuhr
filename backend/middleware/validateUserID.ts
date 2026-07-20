import {isValidUserId} from "../utils/inputValidation";
import {Request, Response, NextFunction} from "express";

export function validateUserID(req: Request, res: Response, next: NextFunction) {
    if (!isValidUserId(req.params.id)) {
        return res.status(400).send("invalid user id");
    }
    next()
}