import { Router } from "express";
import {
    notificationListGet,
    notificationPost,
    notificationGet,
    notificationPatch,
    notificationDelete
} from "../service/notification";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get('/users/:id/notifications', authMiddleware("user", true), async (req, res) => {
    try {
        const userid = Number(req.params.id);
        const notificationList = await notificationListGet(userid);
        return res.status(200).send(notificationList);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.post('/notifications/', authMiddleware("user", true), async (req, res) => {
    try {
        const body: any = req.body;
        if (!body.date) {
            return res.status(400).send("bad request");
        }
        const userid = Number(req.headers.userid);
        const notification = await notificationPost(userid, body.date);
        return res.status(201).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.get('/notifications/:id', authMiddleware("user", true), async (req, res) => {
    try {
        const userid = Number(req.headers.userid);
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            return res.status(400).send("bad request");
        }
        const notification = await notificationGet(userid, id);
        return res.status(200).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.patch('/notifications/:id', authMiddleware("user", true), async (req, res) => {
    try {
        const body: any = req.body;
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            return res.status(400).send("bad request");
        }
        const isRead = Boolean(body.read);
        const notification = await notificationPatch(id, isRead);
        return res.status(204).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.delete('/notifications/:id', authMiddleware("user", true), async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            return res.status(400).send("bad request");
        }
        const notification = await notificationDelete(id);
        return res.status(204).send("deleted successfully");
    } catch (e) {
        res.status(500).send("internal error");
    }
})

export default router;