import { Router } from "express";
import{ createTimeEntryService, setEndTimeService, getTimeEntriesService, getSingleTimeEntryService, getLastTimeEntryService, deleteTimeEntryService } from '../service/timeEntriesService';

const router = Router();

router.post('/timeEntries/', async (req, res) => {
    try{
        const reqBody: any = req.body;
        if(!reqBody){
            return res.status(400).send("bad request");
        }
        const createdTimeEntry = await createTimeEntryService(reqBody.userid, reqBody.starttime, reqBody.endtime, reqBody.type);
        if(createdTimeEntry == "not able to work on weekends"|| createdTimeEntry == "out of working time" || createdTimeEntry == "last time entry has no end time"){
            return res.status(400).json({"error": createdTimeEntry});
        }
        return res.status(201).send(createdTimeEntry);
    }
    catch(error){
        res.status(500).send("internal error");
    }
})

/*router.patch('/timeEntries/:id', async (req, res) => {
    try{
        const reqBody: any = req.body;
        if(!reqBody){
            return res.status(400).send("bad request");
        }
        const patchEndTime = await setEndTimeService(reqBody.timeEntryId, reqBody.endtime);
        if(patchEndTime == "end time is already set" || patchEndTime == "end time is before start time"){
            return res.status(400).json({"error": patchEndTime});
        }
    }
    catch(error){
        res.status(500).send("internal error");
    }
})*/

router.delete('/timeEntries/:id', async (req,res) => {
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