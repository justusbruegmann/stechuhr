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
        const validTypes = ["work", "holiday", "sick"];
        if(!reqBody.type || !validTypes.includes(reqBody.type)){
            return res.status(400).send("type is required and has to be work, holiday or sick");
        }
        if(!reqBody.startTime){
            return res.status(400).send("starttime is needed");
        }
        if(isNaN(new Date(reqBody.startTime).getTime())){
            return res.status(400).send("starttime is not valid");
        }
        if(reqBody.endTime){
            if(isNaN(new Date(reqBody.endTime).getTime())){
            return res.status(400).send("endtime is not valid");
        }
        }
        const userid = res.locals.user.id;
        const createdTimeEntry = await createTimeEntryService(userid, new Date(reqBody.startTime),  reqBody.endTime ? new Date(reqBody.endTime) : undefined, reqBody.type);
        if(
            createdTimeEntry == "not able to work on weekends"|| 
            createdTimeEntry == "out of working time" || 
            createdTimeEntry == "last time entry has no end time" ||
            createdTimeEntry == "not able to work on holidays" ||
            createdTimeEntry == "end time is before startime"
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
        if(!reqBody?.endtime){
            return res.status(400).send("bad request");
        }
        if(isNaN(new Date(reqBody.endtime).getTime())){
            return res.status(400).send("endtime is not valid");
        }
        const timeEntryId = Number(req.params.id);
        const userid = res.locals.user.id;
        const patchEndTime = await setEndTimeService(timeEntryId, new Date(reqBody.endtime), userid);
        if(patchEndTime == "time entry not found"){
            return res.status(404).json({"error": patchEndTime});
        }
        if(patchEndTime == "end time is already set" || patchEndTime == "end time is before start time"){
            return res.status(400).json({"error": patchEndTime});
        }
        if(patchEndTime == "not authorized to modify this entry"){
            return res.status(403).json({"error": patchEndTime});
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
        const {type, startDate, endDate} = req.query;
        if (!type || !["work", "holiday", "sick"].includes(type as string)) {
            return res.status(400).send("type is required and must: work, holiday, sick");
        }
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;
        const timeEntries = await getTimeEntriesService(userid, type as "work"|"holiday"|"sick", start, end);
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
        const userid = res.locals.user.id;
        const result = await deleteTimeEntryService(deletedTimeEntry, userid);
        if(result == "time entry not found" || result == "not authorized to delete this entry"){
            return res.status(result == "time entry not found" ? 404 : 403).json({"error": result});
        }
        return res.status(200).send(result);
    }
    catch(error){
        res.status(500).send("internal error");
    }
})

export default router;