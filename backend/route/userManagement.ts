import {Router} from "express";
import {userCreation, OTPChange, authUser, usersGet, userDelete} from "../service/userManagement";
import {deleteUser} from "../repository/userManagement";

const router = Router();

router.post('/', async (req, res) => {
    //TODO: add admin auth
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
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

router.put('/:id/otp', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
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
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
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

router.get('/:managerId/requests', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    //TODO: add Manager auth
    //TODO: wire to requests service once implemented
    try {
        const managerId = Number(req.params.managerId);
        if (!managerId) {
            return res.status(400).send("bad request");
        }
        const requests: any[] = [];
        return res.status(200).send(requests);
    } catch (error) {
        res.status(500).send("internal error");
    }
})

router.delete('/:id', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    //TODO: add Admin auth
    try {
        const id = Number(req.params.id)
        if (!req.body) {
            return res.status(400).send("bad request");
        }
        const result = await deleteUser(id);
        return res.status(204).send();
    } catch (error) {
        res.status(500).send("internal error");
    }
})

router.get("/:userId/timeentries", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const type = req.query.type;
    const time = req.query.time;
    const userID = req.params.userId
    const auth = 123123;
    const succes = Boolean(auth);

    if (!type) {
        return res.status(400).send({error: "Bad Request"})
    }
    if (auth === null) {
        return res.status(401).send({error: "Unauthorized"})

    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }

    return res.status(200).send([])

})

export default router;
