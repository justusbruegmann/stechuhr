import {Router} from "express";

const router = Router();

// Request resource: { id, userId, managerId, type, startTime, endTime, approved }
// type covers the different kinds of requests (e.g. vacation, sick, ...) via a type field.

router.get("/", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const managerId = req.query.managerId;
    const type = req.query.type;
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

router.post("/", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const body: { userId: number, managerId: number, type: string, startTime: Date, endTime: Date } = req.body;
    const auth = 123123;
    const succes = false

    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (!body || !body.type || body.startTime === null) {
        return res.status(400).send({error: "Bad Request"})
    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }
    return res.status(201).send()

})

router.get("/:id", (req, res) => {
    const token = req.headers.authorization;
    const userId = Number(req.headers.userid);
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
    return res.status(200).send()

})

router.put("/:id", (req, res) => {
    const token = req.headers.authorization;
    const userId = Number(req.headers.userid);
    const id = req.params.id
    const body: { approved: boolean, startTime: Date, endTime: Date } = req.body;
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
    return res.status(204).send()

})

router.delete("/:id", (req, res) => {
    const token = req.headers.authorization;
    const userId = Number(req.headers.userid);
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