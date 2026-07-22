import { Router } from "express";
import {
    notificationListGet,
    notificationPost,
    notificationGet,
    notificationPatch,
    notificationDelete
} from "../service/notification";
import { authMiddleware } from "../middleware/auth";
import { validateUserID } from "../middleware/validateUserID";
import { validateRequestBody } from "../middleware/validateRequestBody";
import { notificationPostBodySchema, NotificationPostBody, notificationPatchBodySchema, NotificationPatchBody } from "../schemas/notifications";

const router = Router();

router.get('/users/:id/notifications', validateUserID, authMiddleware("user", true), async (req, res) => {
    try {
        const userid = Number(req.params.id);

        if (res.locals.user.id !== userid)
            return res.status(403).send("forbidden");

        const notificationList = await notificationListGet(userid);
        return res.status(200).send(notificationList);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.post('/notifications/', authMiddleware("user", true), validateRequestBody(notificationPostBodySchema), async (req, res) => {
    try {
        const body = req.body as NotificationPostBody;
        const userid = Number(res.locals.user.id);
        const notification = await notificationPost(userid, body.date);
        return res.status(201).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.get('/notifications/:id', validateUserID, authMiddleware("user", true), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const notification = await notificationGet(id);

        if (!notification || notification.length === 0) {
            return res.status(404).send("not found");
        }
        if (notification[0].userId !== res.locals.user.id) {
            return res.status(403).send("forbidden");
        }

        return res.status(200).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.patch('/notifications/:id', validateUserID, authMiddleware("user", true), validateRequestBody(notificationPatchBodySchema), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const EXnotification = await notificationGet(id);

        if (!EXnotification || EXnotification.length === 0) {
            return res.status(404).send("not found");
        }
        if (EXnotification[0].userId !== res.locals.user.id) {
            return res.status(403).send("forbidden");
        }

        const body = req.body as NotificationPatchBody;
        const notification = await notificationPatch(id, body.read);
        return res.status(200).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.delete('/notifications/:id', validateUserID, authMiddleware("user", true), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const EXnotification = await notificationGet(id);

        if (!EXnotification || EXnotification.length === 0) {
            return res.status(404).send("not found");
        }
        if (EXnotification[0].userId !== res.locals.user.id) {
            return res.status(403).send("forbidden");
        }

        await notificationDelete(id);
        return res.status(200).send({ message: "deleted successfully" });
    } catch (e) {
        res.status(500).send("internal error");
    }
})

export default router;