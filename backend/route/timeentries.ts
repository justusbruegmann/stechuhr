import {Router} from "express";

const router = Router();



router.post("/", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const body: { id: number, startTime: Date } = req.body;
    const auth = 123123;
    const succes = false
    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (!body) {
        return res.status(400).send({error: "Bad Request"})
    }
    if (succes) {
        return res.status(200).send({id: body.id, startTime: body.startTime, created: true})
    }
    return res.status(500).send({error: "Internal Server Error"})

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
    return res.status(200).send({id, startTime: new Date(), endTime: new Date()})

})

router.put("/:id", (req, res) => {
    const token = req.headers.authorization;
    const id = Number(req.headers.userid);
    const id = req.params.id
    const body: { endTime: Date } = req.body;
    const auth = 123123;
    const succes = false

    if (!auth) {
        return res.status(401).send({error: "Unauthorized"});
    }
    if (!body || body.endTime === null) {
        return res.status(400).send({error: "Bad Request"});
    }
    if (succes === false) {
        return res.status(500).send({error: "Internal Server Error"})
    }
    return res.status(200).send({id, endTime: body.endTime, updated: true})

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