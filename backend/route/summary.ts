import {Router} from "express";
import {authMiddleware} from "../middleware/auth";

const router = Router();

router.get(
    '/',
    authMiddleware("user"),
    async (req, res) => {

        let test = "ich bin eine summary"

        return res.status(200).json({"summary": test});
    })
;

export default router;
