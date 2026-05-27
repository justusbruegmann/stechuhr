import {Router} from "express";
import {
    userCreation,
    OTPChange,
    authUser,
    usersGet,
    userDelete,
    managerGet,
    managerUpdate, roleUpdate
} from "../service/userManagement";
import {authHelper} from "../utils/auth";

const router = Router();

router.post('/', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    if (!token || !id) {
        return res.status(401).json({"error": "No token provided"});
    }
    const authUser = await authHelper(token, id, "admin")
    if (!authUser?.authorized) {
        return res.status(401).json({"error": "unauthorized"});
    }

    try {
        const body: any = req.body;
        if (!body) {
            return res.status(400).send("bad request");
        }
        const createdUser = await userCreation(body.username, body.role, body.managerId);
        if (createdUser === "manager does not exist" || createdUser == "role does not exist" || createdUser === "username exists") {
            return res.status(400).json({"error": createdUser});
        }
        return res.status(201).send(createdUser);
    } catch (error) {
        return res.status(500).send("internal error");
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
        console.log(isUser);
        if (!isUser) {
            return res.status(401).send("Unauthorized");
        }
        const changed: any = await OTPChange(id, newpwd);
        if (changed === "invalid password") {
            return res.status(400).send("need 8 characters, upper/lowercase, numbers,special");
        }
        return res.status(200).send("changed successfully");
    } catch (error) {
        return res.status(500).send("internal error");
    }
})

router.get('/', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    if (!token || !id) {
        return res.status(401).json({"error": "No token provided"});
    }
    const authUser = await authHelper(token, id, "admin")
    if (!authUser?.authorized) {
        return res.status(401).json({"error": "unauthorized"});
    }
    try {
        const limit = Number(req.query.limit) || 25;
        const offset = Number(req.query.offset) || 0;
        const users = await usersGet(limit, offset);
        return res.status(200).send(users);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.delete('/:id', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    if (!token || !id) {
        return res.status(401).json({"error": "No token provided"});
    }
    const authUser = await authHelper(token, id, "admin")
    if (!authUser?.authorized) {
        return res.status(401).json({"error": "unauthorized"});
    }
    try {
        const deleteId = Number(req.params.id)
        const result = await userDelete(deleteId);
        return res.status(200).send("deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("internal error");
    }
})

router.get('/managers', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    if (!token || !id) {
        return res.status(401).json({"error": "No token provided"});
    }
    const authUser = await authHelper(token, id, "admin")
    if (!authUser?.authorized) {
        return res.status(401).json({"error": "unauthorized"});
    }
    const result = await managerGet();
    return res.status(200).send(result);
})

router.put('/user/manager/:id', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    if (!token || !id) {
        return res.status(401).json({"error": "No token provided"});
    }
    const authUser = await authHelper(token, id, "admin")
    if (!authUser?.authorized) {
        return res.status(401).json({"error": "unauthorized"});
    }
    const userId: number = Number(req.params.id);
    const managerid:number = req.body.managerid;
    const update = await managerUpdate(userId,managerid)
    if (update === "manager does not exist") {
        return res.status(400).send("manager does not exist");
    }
    if (update === "is not a manager") {
        return res.status(400).send("is not a manager");
    }
    return res.sendStatus(204);
})

router.put('/user/role/:id', async (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    if (!token || !id) {
        return res.status(401).json({"error": "No token provided"});
    }
    const authUser = await authHelper(token, id, "admin")
    if (!authUser?.authorized) {
        return res.status(401).json({"error": "unauthorized"});
    }
    const userId: number = Number(req.params.id);
    const role: string = req.body.role;
    const update = await roleUpdate(userId,role)
    if (update === "invalid role") {
        return res.status(400).send("invalid role");
    }
    return res.sendStatus(204);
})
export default router;
