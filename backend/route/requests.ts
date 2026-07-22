import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { validateQueryParameters } from "../middleware/validateQueryParameters";
import { getRequestsRequestParameterSchema, getRequestsRequestParameter, requestsRequestBodySchema, requestsRequestBody, updateRequestsRequestBodySchema, UpdateRequestBody } from "../schemas/requests";
import * as requestsService from "../service/requests";
import * as userManagementService from "../service/userManagement";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { InvalidDateRangeError, NotEnoughHolidaysLeft, NotFoundError, RequestOverlapWithRequestError, RequestOverlapWithTimeEntryError, UnauthorizedError } from "../errors/requestErrors";
import { validateUserID } from "../middleware/validateUserID";

const router = Router();

router.get(
    '/requests',
    authMiddleware("user", true),
    validateQueryParameters(getRequestsRequestParameterSchema),
    async (req, res) => {
        const queryParams = res.locals.queryParams as getRequestsRequestParameter;

        const { userId, startDate, endDate } = queryParams;
        const requesterId = res.locals.user.id;

        if (requesterId == userId) {
            try {
                const requests = await requestsService.getRequestsForUser(userId, startDate, endDate);
                return res.status(200).json(requests);
            } catch (error) {
                if (error instanceof InvalidDateRangeError) {
                    return res.status(400).json({
                        code: error.code,
                        message: error.message
                    });
                }
                return res.status(500).json({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Etwas ist schiefgelaufen",
                })
            }
        }

        try {
            const user = await userManagementService.getUserById(userId);
            if (user?.managerid == requesterId) {
                const requests = await requestsService.getRequestsForUser(userId, startDate, endDate);

                return res.status(200).json(requests);
            }

            return res.status(401).json({
                code: "UNAUTHORIZED",
                message: "Sie haben nicht die nötige Berechtigung"
            });
        } catch (error) {
            if (error instanceof InvalidDateRangeError) {
                return res.status(400).json({
                    code: error.code,
                    message: error.message,
                });
            }
            return res.status(400).send("Bad Request")
        }

    });

router.get(
    '/requests/manager',
    authMiddleware("manager"),
    async (req, res) => {
        const managerId = res.locals.user.id;
        try {
            const requests = await requestsService.getAllRequestsAManagerIsResponsibleFor(managerId);
            return res.status(200).json(requests);
        } catch {
            return res.status(500).json({
                code: "INTERNAL_SERVER_ERROR",
                message: "Etwas ist schiefgelaufen",
            })
        }
    });

router.get(
    '/requests/:id',
    validateUserID,
    authMiddleware("user", true),
    async (req, res) => {
        const requesterId = res.locals.user.id;
        const requestId = Number(req.params.id);
        try {
            const request = await requestsService.getSingleRequestById(requestId);
            if (request.userId !== requesterId || request.managerId !== requesterId) {
                return res.status(401).json({
                    code: "UNAUTHORIZED",
                    message: "Sie haben nicht die nötige Berechtigung"
                });
            }
            return res.status(200).json(request);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    code: error.code,
                    message: error.message,
                });
            }
            return res.status(400).send("Bad Request");
        }
    });

router.post(
    '/requests',
    authMiddleware("user", true),
    validateRequestBody(requestsRequestBodySchema),
    async (req, res) => {
        const body = req.body as requestsRequestBody;

        const { type, startDate, endDate, remark } = body;

        const userId = res.locals.user.id;
        try {
            const createdRequest = await requestsService.createRequest(userId, type, startDate, endDate, remark);

            return res.status(201).send();
        } catch (error) {
            if (error instanceof InvalidDateRangeError) {
                return res.status(400).json({
                    code: error.code,
                    message: error.message,
                });
            }
            if (error instanceof RequestOverlapWithTimeEntryError) {
                return res.status(409).json({
                    code: error.code,
                    message: error.message,
                });
            }
            if (error instanceof RequestOverlapWithRequestError) {
                return res.status(409).json({
                    code: error.code,
                    message: error.message
                })
            }
            if (error instanceof NotEnoughHolidaysLeft) {
                return res.status(409).json({
                    code: error.code,
                    message: error.message
                })
            }
            return res.status(500).json({
                code: "INTERNAL_SERVER_ERROR",
                message: "Etwas ist schiefgelaufen",
            })
        }
    });

router.patch(
    '/requests/:id',
    validateUserID,
    authMiddleware("manager"),
    validateRequestBody(updateRequestsRequestBodySchema),
    async (req, res) => {

        const id = Number(req.params.id);
        const requesterId = res.locals.user.id;
        const { approved } = req.body as UpdateRequestBody;

        try {
            const updatedRequest = await requestsService.updateRequest(id, requesterId, approved);

            return res.status(200).json(updatedRequest);

        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return res.status(401).json({
                    code: error.code,
                    message: error.message,
                });
            }
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    code: error.code,
                    message: error.message,
                });
            }
            return res.status(500).json({
                code: "INTERNAL_SERVER_ERROR",
                message: "Etwas ist schiefgelaufen",
            });
        }
    });

router.delete(
    '/requests/:id',
    validateUserID,
    authMiddleware("user", true),
    async (req, res) => {

        const id = Number(req.params.id);
        const requesterId = res.locals.user.id;

        try {
            const deletedRequest = await requestsService.deleteRequest(id, requesterId);

            return res.status(200).json(deletedRequest);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return res.status(401).json({
                    code: error.code,
                    message: error.message,
                });
            }
            return res.status(500).json({
                code: "INTERNAL_SERVER_ERROR",
                message: "Etwas ist schiefgelaufen",
            });
        }
    }
)

export default router;