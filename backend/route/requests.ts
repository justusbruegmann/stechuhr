import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { validateQueryParameters } from "../middleware/validateQueryParameters";
import { getRequestsRequestParameterSchema, getRequestsRequestParameter, requestsRequestParameterSchema, requestsRequestParameter, updateRequestsRequestParameterSchema, updateRequestsRequetParameter } from "../schemas/requests";
import * as requestsService from "../service/requests";
import * as userManagementService from "../service/userManagement";
import User from "../types/users";

const router = Router();

router.get(
    '/requests',
    authMiddleware("user", true),
    validateQueryParameters(getRequestsRequestParameterSchema),
    async (req, res) => {
        const queryParams = res.locals.queryParams as getRequestsRequestParameter;

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

router.get(
    '/requests/manager/:managerId',
    authMiddleware("manager"),
    async (req, res) => {
        try {
            const managerId = Number(req.params.managerId);
            const requests = await requestsService.getAllRequestsAManagerIsResponsibleFor(managerId);
            return res.status(200).json(requests);
        } catch {
            return res.status(404).send("Not Found");
        }
    });

router.post(
    '/requests',
    authMiddleware("user", true),
    validateQueryParameters(requestsRequestParameterSchema),
    async (req, res) => {
        const queryParams = res.locals.queryParams as requestsRequestParameter;

        const { type, startDate, endDate, remark } = queryParams;

        const userId = res.locals.user.id;
        try {
            const createdRequest = await requestsService.createRequest(userId, type, startDate, endDate, remark);

            return res.status(201).send();
        } catch {
            return res.status(400).send("Bad Request");
        }
    });

router.patch(
    '/requests/:id',
    authMiddleware("manager", true),
    validateQueryParameters(updateRequestsRequestParameterSchema),
    async (req, res) => {

        const queryParams = res.locals.queryParams as updateRequestsRequetParameter;

        try {
            const id = Number(req.params.id);

            const approved = queryParams.approved;

            const updatedRequest = await requestsService.updateRequest(id, approved);

            return res.status(200).json(updatedRequest);
        } catch {
            return res.status(400).send("Bad request");
        }
    }
)

export default router;