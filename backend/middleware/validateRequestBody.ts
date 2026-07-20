import { RequestHandler } from "express";
import { ZodObject } from "zod";


export function validateRequestBody(
    schema: ZodObject
): RequestHandler {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid request body",
                details: parsed.error.issues,
            });
        }

        req.body = parsed.data;
        next();
    };
}