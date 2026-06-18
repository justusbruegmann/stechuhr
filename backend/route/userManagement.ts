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
import {authMiddleware} from "../middleware/auth";

const router = Router();

router.post('/users/',authMiddleware("admin"), async (req, res) => {

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

router.put('/users/otp/:id', async (req, res) => {
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

router.get('/users/',authMiddleware("admin"), async (req, res) => {

    try {
        const limit = Number(req.query.limit) || 25;
        const offset = Number(req.query.offset) || 0;
        const users = await usersGet(limit, offset);
        return res.status(200).send(users);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.delete('/users/:id',authMiddleware("admin"), async (req, res) => {
    try {
        const deleteId = Number(req.params.id)
        const result = await userDelete(deleteId);
        return res.status(200).send("deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("internal error");
    }
})

router.get('/users/managers', authMiddleware("admin"), async (req, res) => {

    const result = await managerGet();
    return res.status(200).send(result);
})

router.put('/users/:id/manager',authMiddleware("admin"), async (req, res) => {
    const userId: number = Number(req.params.id);
     if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).send("invalid user id");
  }
    const managerid:number= Number(req.body.managerid);
     if (!Number.isInteger(managerid) || managerid <= 0) {
      return res.status(400).send("invalid managerid");
  }
    const update = await managerUpdate(userId,managerid)
    if (update === "manager does not exist") {
        return res.status(400).send("manager does not exist");
    }
    if (update === "is not a manager") {
        return res.status(400).send("is not a manager");
    }
    return res.sendStatus(204);
})

router.put('/users/:id/role',authMiddleware("admin"), async (req, res) => {

    const userId: number = Number(req.params.id);
     if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).send("invalid user id");
  }
    const role: string = req.body.role;
    const update = await roleUpdate(userId,role)
    if (update === "invalid role") {
        return res.status(400).send("invalid role");
    }
    return res.sendStatus(204);
})
export default router;
