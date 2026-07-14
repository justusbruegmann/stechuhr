import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { validateQueryParameters } from "../middleware/validateQueryParameters";
import { requestsRequestParameterSchema, requestsRequestParameter } from "../schemas/requests";
import * as requestsService from "../service/requests";
import * as userManagementService from "../service/userManagement"
import User from "../types/users";

const router = Router();

router.get(
    '/requests/',
    authMiddleware("user", true),
    validateQueryParameters(requestsRequestParameterSchema),
    async (req, res) => {
        const queryParams = res.locals.queryParams as requestsRequestParameter;

        const userId = queryParams.userId;

        const requesterId = res.locals.user.id;

        if (requesterId == userId) {
            const requests = await requestsService.getAllRequestsForUser(userId);
            return res.status(200).json(requests);
        } else {
            try {
                const user = await userManagementService.getUserById(userId);
                if (user?.managerid == requesterId) {
                    const requests = await requestsService.getAllRequestsForUser(userId);

                    return res.status(200).json(requests);
                } else {
                    return res.status(401).send("Unauthorized")
                }
            } catch {
                return res.status(401).send("Unauthorized");
            }
        }
    });

export default router;
