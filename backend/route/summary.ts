import {Router} from "express";
import {authMiddleware} from "../middleware/auth";
import {validateQueryParameters} from "../middleware/validateQueryParameters";
import {generateSummary} from "../service/summary";
import {summaryRequestParameterSchema} from "../schemas/summary";

const router = Router();

router.get(
    '/summary',
    authMiddleware("user"),
    validateQueryParameters(summaryRequestParameterSchema),
    async (req, res) => {
        const queryParams = res.locals.queryParams;
        if (!queryParams) {
            return res.status(500).json({error: "Missing parsed query parameters"});
        }

        const {userId, startTime, endTime} = queryParams;

        const summary = generateSummary(userId, startTime, endTime);

        return res.status(200).json({"summary": summary});
    });

export default router;
