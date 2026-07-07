import { Router } from "express";
import {
    notificationListGet,
    notificationPost,
    notificationGet,
    notificationPatch,
    notificationDelete
} from "../service/notification";

const router = Router();

router.get('/users/:id/notifications', async (req, res) => {
    try {
        const userid = Number(req.params.id);
        const notificationList = await notificationListGet(userid);
        return res.status(200).send(notificationList);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.post('/notifications/', async (req, res) => {
    try {
        const body: any = req.body;
        const userid = Number(req.headers.userid);
        const notification = await notificationPost(userid, body.date);
        return res.status(201).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.get('/notifications/:id', async (req, res) => {
    try {
        const userid = Number(req.headers.userid);
        const id = Number(req.params.id);
        const notification = await notificationGet(userid, id);
        return res.status(200).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.patch('/notifications/:id', async (req, res) => {
    try {
        const body: any = req.body;
        const id = Number(req.params.id);
        const isRead = Boolean(body.read);
        const notification = await notificationPatch(id, isRead);
        return res.status(200).send(notification);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.delete('/notifications/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const notification = await notificationDelete(id);
        return res.status(200).send("deleted successfully");
    } catch (e) {
        res.status(500).send("internal error");
    }
})

export default router;