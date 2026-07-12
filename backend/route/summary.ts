import {Router} from "express";
import {authMiddleware} from "../middleware/auth";
import {validateQueryParameters} from "../middleware/validateQueryParameters";
import {generateSummary} from "../service/summary";
import {summaryRequestParameterSchema} from "../schemas/summary";
import Summary from "../types/summary";

const router = Router();

router.get(
    '/summary',
    authMiddleware("user", true),
    validateQueryParameters(summaryRequestParameterSchema),

    async (req, res) => {
        const queryParams = res.locals.queryParams;
        if (!queryParams) {
            return res.status(500).json({error: "Missing parsed query parameters"});
        }

        const {userId, startDate, endDate} = queryParams;

        const summary: Summary = await generateSummary(userId, startDate, endDate);

        return res.status(200).json(summary);
    });

export default router;
