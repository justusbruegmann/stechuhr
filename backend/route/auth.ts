import {Router} from "express";
import {auth} from "../service/auth";

const router = Router();

router.get('/auth/', async (req, res) => {
    let token: string | undefined = req.headers.authorization;
    let userId: number | undefined = Number(req.headers.userid);
    if (token && userId) {
        const authUser = await auth(undefined, undefined, token, userId);
        if (!authUser) {
            return res.status(404).send("Not Found");
        }
        if (authUser?.succes) {
            return res.status(200).json({"role": authUser.role, "id": authUser.userId});
        } else {
            if (authUser.message === "Unauthorized") {
                return res.status(401).send("not_authorized");
            } else if (authUser.message === "has one time password") {
                // for the identification that there is an otp
                return res.status(485).json({"message":"Has onetime password", "userId": authUser.userId});
            } else {
                return res.status(401).send("Not authorized IDK");
            }
        }
    }
});

router.post("/login/", async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).send("Not Found Body");
    }
    if (body.username && body.password && typeof body.username === "string" && typeof body.password === "string") {
        const authUser = await auth(body.username, body.password, undefined, undefined);
        if (!authUser) {
            return res.status(404).send("Not Found");
        }
        if (authUser?.succes) {
            return res.status(201).json({
                "id": authUser.userId,
                "session": authUser.sessionToken,
                "role": authUser.role
            })
        } else {
            if (authUser.message === "Invalid username") {
                return res.status(401).send("not_authorized");
            }
            if (authUser.message === "user has one time password") {
                // for the identification that there is an otp
                return res.status(485).json({"message":"Has onetime password", "userId": authUser.userId});
            }
        }
    }
})

export default router;
