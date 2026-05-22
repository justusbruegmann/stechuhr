import {Router} from "express";
import {auth} from "../service/auth";

const router = Router();

router.get('/', async (req, res) => {
    const body: any = req.body;
    let token: string | undefined = req.headers.authorization;
    let userId: number | undefined = Number(req.headers.userid);
    if (token && userId) {
        const authUser = await auth(undefined, undefined, token, userId);
        if (!authUser) {
            return res.status(404).send("Not Found");
        }
        if (authUser?.succes) {
            return res.status(200).send({"role": authUser.role});
        } else {
            if (authUser.message === "Unauthorized") {
                return res.status(401).send("not_authorized");
            } else if (authUser.message === "has one time password") {
                // for the identification that there is an otp
                return res.status(485).send("Has onetime password");
            } else {
                return res.status(401).send("Not authorized IDK");
            }
        }
    }

    if (!body) {
        return res.status(400).send("Not Found");
    }
    if (body.username && body.password) {
        const authUser = await auth(body.username, body.password, undefined, undefined);
        if (!authUser) {
            return res.status(404).send("Not Found");
        }
        if (authUser?.succes) {
            return res.status(200).send({
                "id": authUser.userId,
                "session": authUser.sessionToken,
                "role": authUser.role
            })
        } else {
            if (authUser.message === "Invalid username") {
                return res.status(401).send("not_authorized");
            }
            if (authUser.message === "") {
                // for the identification that there is an otp
                return res.status(485).send("Has onetime password");
            }
        }
    }


})
;

export default router;
