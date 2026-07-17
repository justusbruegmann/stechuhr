import {Router} from "express";
import * as service from "../service/userManagement";
import {
    authUser,
    managerGet,
    managerGetOwnUsers,
    managerUpdate,
    OTPChange,
    roleUpdate,
    userCreation,
    userDelete,
    usersGet
} from "../service/userManagement";
import {authMiddleware} from "../middleware/auth";
import {EmploymentRequest, employmentRequestSchema} from "../schemas/employment";
import {isLoggedInUser, isUserManagedByManager} from "../utils/authorization";
import {isValidUserId} from "../utils/inputValidation";
import User from "../types/users";
import {validateUserID} from "../middleware/validateUserID";
import {validateBody} from "../middleware/validateUserBody";

const router = Router();

router.post('/users/', authMiddleware("admin"), validateBody, async (req, res) => {

    try {
        const body: any = req.body;
        const createdUser = await userCreation(body.username, body.role, body.managerId, body.workload, body.holidays);
        if (createdUser === "manager does not exist" || createdUser == "role does not exist" || createdUser === "username exists") {
            return res.status(400).json({"error": createdUser});
        }
        return res.status(201).send(createdUser);
    } catch (error) {
        return res.status(500).send("internal error");
    }
});

router.patch('/users/otp/:id', validateUserID, async (req, res) => {
    try {

        const currentpwd: string = req.body.currentpwd;
        const newpwd: string = req.body.newpwd;
        const id = Number(req.params.id)
        if (!req.body) {
            return res.status(400).send("bad request");
        }
        if (!currentpwd || !newpwd || typeof currentpwd !== "string" || typeof newpwd !== "string") {
            return res.status(400).send("bad request");
        }
        if(newpwd.length >48) {
            return res.status(400).send("bad request");
        }
        const isUser = await authUser(id, currentpwd);
        console.log(isUser);
        if (!isUser) {
            return res.status(401).send("Unauthorized");
        }
        const changed: any = await OTPChange(id, newpwd);
        if (changed === "invalid password") {
            return res.status(400).send("need 8 characters, upper/lowercase, numbers,special");
        }
        return res.status(200).json({"status": "changed successfully"});
    } catch (error) {
        return res.status(500).send("internal error");
    }
})

router.get('/users/', authMiddleware("admin"), async (req, res) => {
    try {
        const users = await usersGet();
        return res.status(200).send(users);
    } catch (e) {
        res.status(500).send("internal error");
    }
})

router.delete('/users/:id', validateUserID, authMiddleware("admin"), async (req, res) => {
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
    try {
        const result = await managerGet();
        return res.status(200).send(result);
    } catch (e) {
        return res.status(500).send("internal error")
    }
})

router.get('/users/managers/users', authMiddleware("manager"), async (req, res) => {
    const userId = res.locals.user.id;
    const result = await managerGetOwnUsers(userId);
    return res.status(200).send(result);
})

router.patch('/users/:id/manager', validateUserID, authMiddleware("admin"), async (req, res) => {
    try {
        const userId: number = Number(req.params.id);
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).send("invalid user id");
        }
        const managerid: number = Number(req.body.managerid);
        if (!Number.isInteger(managerid) || managerid <= 0) {
            return res.status(400).send("invalid managerid");
        }
        const update = await managerUpdate(userId, managerid)
        if (update === "manager does not exist") {
            return res.status(400).send("manager does not exist");
        }
        if (update === "is not a manager") {
            return res.status(400).send("is not a manager");
        }
        return res.sendStatus(204);
    } catch (e) {
        return res.status(500).send("internal error")
    }
})

router.patch('/users/:id/role', validateUserID, authMiddleware("admin"), async (req, res) => {
    try {
        const userId: number = Number(req.params.id);
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).send("invalid user id");
        }
        const role: string = req.body.role;
        const update = await roleUpdate(userId, role)
        if (update === "invalid role") {
            return res.status(400).send("invalid role");
        }
        return res.sendStatus(204);
    } catch (e) {
        return res.status(500).send("internal error")
    }
})

router.get('/users/:id', authMiddleware("user", true), async (req, res) => {

    // Validate inputs
    if (!isValidUserId(req.params.id)) {
        return res.status(400).send("invalid user id");
    }
    const userId = Number(req.params.id)


    // Check permissions
    let user: User | null = null;
    try {
        user = await service.getUserById(userId);
    } catch (e) {
        res.status(500).send("internal error");
    }

    if (!user) {
        return res.status(404).send("user not found");
    }

    if (!isLoggedInUser(user, res.locals.user.id) && !isUserManagedByManager(user, res.locals.user.id))
        return res.status(401).send("unauthorized");


    // Action
    return res.status(200).send(user);
})


router.patch('/users/:id/employment', authMiddleware("manager"), async (req, res) => {

    // Validate inputs
    if (!isValidUserId(req.params.id)) {
        return res.status(400).send("invalid user id");
    }
    const userId = Number(req.params.id)

    const bodyParseResult = employmentRequestSchema.safeParse(req.body);
    if (!bodyParseResult.success) {
        return res.status(400).send(bodyParseResult.error);
    }
    const updateFields: EmploymentRequest = bodyParseResult.data;


    // Check permissions
    let user: User | null = null;
    try {
        user = await service.getUserById(userId);
    } catch (e) {
        return res.status(500).send("internal error");
    }

    if (!user) {
        return res.status(404).send("user not found");
    }

    if (!isUserManagedByManager(user, res.locals.user.id))
        return res.status(401).send("unauthorized");


    // Action
    await service.updateEmploymentDetails(userId, updateFields).catch(_ => {
        return res.status(500).send("internal error");
    });
    return res.sendStatus(204);
})

export default router;
