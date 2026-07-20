import {RequestHandler} from "express";
import {ZodObject} from "zod";
import {SummaryRequestParameter} from "../schemas/summary";


export function validateQueryParameters(schema: ZodObject): RequestHandler {

    return (req, res, next) => {
        const parsed = schema.safeParse(req.query);

        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid query parameters",
                details: parsed.error.issues,
            });
        }

        res.locals["queryParams"] = parsed.data;

        next();
    };
}

