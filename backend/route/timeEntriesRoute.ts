import { Router } from "express";
import{ createTimeEntryService, setEndTimeService, getTimeEntriesService, getSingleTimeEntryService, getLastTimeEntryService, deleteTimeEntryService } from '../service/timeEntriesService';
import { authMiddleware } from "../middleware/auth";

const router = Router();

//create time entry
router.post('/timeEntries/', authMiddleware("user"), async (req, res) => {
    try{
        const reqBody: any = req.body;
        if(!reqBody){
            return res.status(400).send("bad request");
        }
        const userid = res.locals.user.id;
        const createdTimeEntry = await createTimeEntryService(userid, new Date(reqBody.starttime),  reqBody.endTime ? new Date(reqBody.endTime) : undefined, reqBody.type);
        if(
            createdTimeEntry == "not able to work on weekends"|| 
            createdTimeEntry == "out of working time" || 
            createdTimeEntry == "last time entry has no end time" ||
            createdTimeEntry == "not able to work on holidays"
        ){
            return res.status(400).json({"error": createdTimeEntry});
        }
        return res.status(201).send(createdTimeEntry);
    }
    catch(error){
        console.error(error);
        res.status(500).send("internal error");
    }
})

//add end time
router.patch('/timeEntries/:id', authMiddleware("user"), async (req, res) => {
    try{
        const reqBody: any = req.body;
        if(!reqBody){
            return res.status(400).send("bad request");
        }
        const timeEntryId = Number(req.params.id);
        const patchEndTime = await setEndTimeService(timeEntryId, new Date(reqBody.endtime));
        if(patchEndTime == "end time is already set" || patchEndTime == "end time is before start time"){
            return res.status(400).json({"error": patchEndTime});
        }
        return res.status(200).json(patchEndTime);
    }
    catch(error){
        res.status(500).send("internal error");
    }
})

//get all time entries
router.get('/timeEntries/', authMiddleware("user"), async (req, res) => {
    try{
        const userid = res.locals.user.id;
        const timeEntries = await getTimeEntriesService(userid);
        return res.status(200).send(timeEntries);
    }
    catch(error){
        res.status(500).send("internal error");
    }
})


//get last time entry
router.get('/timeEntries/last', authMiddleware("user"), async (req, res) => {
    try{
        const userid = res.locals.user.id;
        const timeEntry = await getLastTimeEntryService(userid);
        return res.status(200).send(timeEntry);
    }
    catch(error){
        res.status(500).send("internal error");
    }
})

//get single time entry
router.get('/timeEntries/:id', authMiddleware("user"), async (req, res) => {
    try{
        const timeEntryId = Number(req.params.id);
        const singleTimeEntry = await getSingleTimeEntryService(timeEntryId);
        return res.status(200).send(singleTimeEntry);
    }
    catch(error){
        res.status(500).send("internal error");
    }
})

//delete time entry
router.delete('/timeEntries/:id', authMiddleware("user"),async (req,res) => {
    try{
        const deletedTimeEntry = Number(req.params.id);
        const result = await deleteTimeEntryService(deletedTimeEntry);
        return res.status(200).send(result);
    }
    catch(error){
        res.status(500).send("internal error");
    }
})

export default router;