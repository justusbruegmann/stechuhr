import {Router} from "express";
import {authMiddleware} from "../middleware/auth";
import {validateQueryParameters} from "../middleware/validateQueryParameters";
import {generateSummary} from "../service/summary";
import {summaryRequestParameterSchema} from "../schemas/summary";
import Summary from "../types/summary";
import {isDateInCorrectTimeframe, isStartDateEarlierThanEndDate, isValidUserId} from "../utils/inputValidation";
import User from "../types/users";
import * as userService from "../service/userManagement";
import {isLoggedInUser, isUserManagedByManager} from "../utils/authorization";


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

        /**
         * Input validation
         */
        if (!isValidUserId(userId)) {
            return res.status(400).send("invalid user id");
        }

        if (!isStartDateEarlierThanEndDate(startDate, endDate)) {
            return res.status(400).send("start date must be earlier than end date");
        }

        if (!isDateInCorrectTimeframe(startDate) || !isDateInCorrectTimeframe(endDate)) {
            return res.status(400).send("dates are not in the correct timeframe");
        }

        /**
         * Permissions
         */
        let user: User | null = null;
        try {
            user = await userService.getUserById(userId);
        } catch (e) {
            res.status(500).send("internal error");
        }

        if (!user) {
            return res.status(404).send("user not found");
        }

        if (!isLoggedInUser(user, res.locals.user.id) && !isUserManagedByManager(user, res.locals.user.id))
            return res.status(401).send("unauthorized");

        /**
         * Generate summary for the user
         */
        const summary: Summary = await generateSummary(user, startDate, endDate);
        return res.status(200).json(summary);
    });

export default router;
