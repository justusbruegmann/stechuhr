import {RequestHandler} from "express";

export function requireQueryParams(keys: string[]): RequestHandler {

    return (req, res, next) => {

        const missingKeys = keys.filter((key) => !req.query[key]);

        if (missingKeys.length > 0) {
            return res.status(400).json({
                error: "Missing required query parameters",
                missing: missingKeys,
            });
        }

        next();
    };
}

