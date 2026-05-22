import {Router} from "express";
import {userCreation, OTPChange, authUser, usersGet, userDelete} from "../service/userManagement";
import {deleteUser} from "../repository/userManagement";

const router = Router();

router.post('/', async (req, res) => {
    //TODO: add admin auth
    try {
        const body: any = req.body;
        if (!body) {
            res.status(400).send("bad request");
        }
        const createdUser = await userCreation(body.username, body.role, body.managerId);
        res.status(201).send(createdUser);
    } catch (error) {
        res.status(500).send("internal error");
    }
});

router.put('/otp/:id', async (req, res) => {
    try {
        const currentpwd: string = req.body.currentpwd;
        const newpwd: string = req.body.newpwd;
        const id = Number(req.params.id)
        if (!req.body) {
            return res.status(400).send("bad request");
        }
        console.log({id, currentpwd, newpwd});
        const isUser = await authUser(id, currentpwd);
        if (!isUser) {
            return res.status(401).send("Unauthorized");
        }
         await OTPChange(id, newpwd);
        return res.status(200).send("changed successfully");
    } catch (error) {
        res.status(500).send("internal error");
    }
})

router.get('/', async (req, res) => {
    //TODO: add Admin Auth
    try {
        const limit = Number(req.query.limit) || 25;
        const offset = Number(req.query.offset) || 0;
        const users = await usersGet(limit, offset);
        return res.status(200).send(users);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.delete('/user/:id', async (req, res) => {
    //TODO: add Admin auth
    try {
        const id = Number(req.params.id)
        if (!req.body) {
            return res.status(400).send("bad request");
        }
        const result = await deleteUser(id);
        return res.status(200).send("deleted successfully");
    } catch (error) {
        res.status(500).send("internal error");
    }
})

export default router;
