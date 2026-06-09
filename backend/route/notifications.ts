import {Router} from "express";

const router = Router();

// Notifications are generated from time entry rules, e.g.:
//  - more than 10h worked on a day
//  - less than 4h worked on the previous day
//  - less than the monthly working time in the previous month
// type identifies which rule triggered the notification.

router.get("/", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const userId = req.query.userId;
    const auth = 123123;
    const succes = false

    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }
    return res.status(200).send([])

})

router.get("/:id", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const id = req.params.id
    const auth = 123123;
    const succes = false

    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (id === null) {
        return res.status(400).send({error: "Bad Request"});
    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }
    return res.status(200).send({id, userId: 0, type: "", message: "", read: false, createdAt: new Date()})

})

router.put("/:id", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const id = req.params.id
    const body: { read: boolean } = req.body;
    const auth = 123123;
    const succes = false

    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (!body) {
        return res.status(400).send({error: "Bad Request"});
    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }
    return res.status(200).send({id, read: body.read, updated: true})

})

router.delete("/:id", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const id = req.params.id
    const auth = 123123;
    const succes = false

    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (id === null) {
        return res.status(400).send({error: "Bad Request"});
    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }
    return res.status(204).send()

})


export default router;