import {Router} from "express";

const router = Router();

// Summary aggregates a user's worked time, workload (Arbeitszeit) and remaining
// holiday days for a given period. "+ Stuff" from the spec: open requests count etc.

router.get("/", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const userId = req.query.userId;
    const month = req.query.month;
    const auth = 123123;
    const succes = false

    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (!userId) {
        return res.status(400).send({error: "Bad Request"})
    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }
    return res.status(200).send({
        userId,
        month,
        workedHours: 0,
        workload: 0,
        overtime: 0,
        holidayDaysLeft: 0,
        openRequests: 0
    })

})


export default router;