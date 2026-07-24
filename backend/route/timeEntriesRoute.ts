import { Router } from "express";
import { createTimeEntryService, setEndTimeService, getTimeEntriesService, getSingleTimeEntryService, getLastTimeEntryService, deleteTimeEntryService } from '../service/timeEntriesService';
import { authMiddleware } from "../middleware/auth";

const router = Router();

const validTypes = ["work", "holiday", "sick"];

const isValidDateString = (dateStr: unknown): boolean => {
    if (typeof dateStr !== "string") return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
};

const isValidId = (idToCheck: unknown): idToCheck is number => {
    if (typeof idToCheck !== "number" && typeof idToCheck !== "string") {
        return false;
    }
    const num = Number(idToCheck);
    return Number.isInteger(num) && num > 0;
}

//create timeentry 
router.post('/timeentries/', authMiddleware("user", true), async (req, res) => {
    try {
        const reqBody = req.body;

        if (!reqBody?.type || !validTypes.includes(reqBody.type)) {
            return res.status(400).json({ error: "type is required and has to be work, holiday or sick" });
        }
        if (res.locals.user.role === "admin") {
            return res.status(400).json({ error: "Admins are not allowed to clock in." });
        }
        if (!reqBody.starttime) {
            return res.status(400).json({ error: "starttime is needed" });
        }
        if (!isValidDateString(reqBody.starttime)) {
            return res.status(400).json({ error: "starttime is not valid" });
        }
        if (reqBody.endtime) {
            if (!isValidDateString(reqBody.endtime)) {
                return res.status(400).json({ error: "endtime is not valid" });
            }
        }
        const userid = res.locals.user.id;
        const createdTimeEntry = await createTimeEntryService(userid, new Date(reqBody.starttime), reqBody.endtime ? new Date(reqBody.endtime) : undefined, reqBody.type);
        if (
            createdTimeEntry == "not able to work on weekends" ||
            createdTimeEntry == "out of working time" ||
            createdTimeEntry == "last time entry has no endtime" ||
            createdTimeEntry == "not able to work on holidays" ||
            createdTimeEntry == "endtime is before starttime" ||
            createdTimeEntry == "time entry overlaps with an other entry"
        ) {
            return res.status(400).json({ "error": createdTimeEntry });
        }
        return res.status(201).json(createdTimeEntry);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal error" });
    }
})

//add end time
router.patch('/timeentries/:id', authMiddleware("user", true), async (req, res) => {
    try {
        const reqBody = req.body;
        const timeEntryId = req.params.id;
        if (!isValidId(timeEntryId)) {
            return res.status(400).json({ error: "invalid id" });
        }
        if (!reqBody?.endtime) {
            return res.status(400).json({ error: "endtime is needed" });
        }
        if (!isValidDateString(reqBody.endtime)) {
            return res.status(400).json({ error: "endtime is not valid" });
        }

        const userid = res.locals.user.id;
        const patchEndTime = await setEndTimeService(Number(timeEntryId), new Date(reqBody.endtime), userid);
        if (patchEndTime == "time entry not found") {
            return res.status(404).json({ error: patchEndTime });
        }
        if (
            patchEndTime == "end time is already set" ||
            patchEndTime == "end time is before start time" ||
            patchEndTime == "end time can not be in the future" ||
            patchEndTime == "time entry overlaps with an other entry"
        ) {
            return res.status(400).json({ error: patchEndTime });
        }
        if (patchEndTime == "not authorized to modify this entry") {
            return res.status(403).json({ error: patchEndTime });
        }
        return res.status(200).json(patchEndTime);
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
})

//get all time entries
router.get('/users/:userId/timeentries', authMiddleware("user", true), async (req, res) => {
    try {
        const userid = req.params.userId;
        if (!isValidId(userid)) {
            return res.status(400).json({ error: "invalid id" });
        }
        if (Number(userid) !== res.locals.user.id) {
            return res.status(403).json({ error: "not allowed" });
        }
        const { type, startDate, endDate } = req.query;
        if (type && !validTypes.includes(type as string)) {
            return res.status(400).json({ error: "type must be: work, holiday, sick" });
        }
        if (startDate && !isValidDateString(startDate)) {
            return res.status(400).json({ error: "startDate is not valid" });
        }
        if (endDate && !isValidDateString(endDate)) {
            return res.status(400).json({ error: "endDate is not valid" });
        }
        const start = startDate ? startDate as string : undefined;
        const end = endDate ? endDate as string : undefined;
        const timeEntries = await getTimeEntriesService(Number(userid), type as "work" | "holiday" | "sick", start, end);
        if (timeEntries == "end date is before start date") {
            return res.status(400).json({ error: timeEntries });
        }
        return res.status(200).json(timeEntries);
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
})

//get last time entry
router.get('/timeentries/last', authMiddleware("user", true), async (req, res) => {
    try {
        const userid = res.locals.user.id;
        const { type } = req.query;
        if (type && !validTypes.includes(type as string)) {
            return res.status(400).json({ error: "type must be: work, holiday, sick" });
        }
        const timeEntry = await getLastTimeEntryService(userid, type as "work" | "holiday" | "sick");
        if (timeEntry == "no time entry found") {
            return res.status(404).json({ error: timeEntry });
        }
        if (timeEntry == "not authorized to view this entry") {
            return res.status(403).json({ error: timeEntry });
        }
        return res.status(200).json(timeEntry);
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
})

//get single time entry
router.get('/timeentries/:id', authMiddleware("user", true), async (req, res) => {
    try {
        const timeEntryId = req.params.id;
        if (!isValidId(timeEntryId)) {
            return res.status(400).json({ error: "invalid id" });
        }
        const userid = res.locals.user.id;
        const singleTimeEntry = await getSingleTimeEntryService(Number(timeEntryId), userid);
        if (singleTimeEntry == "no time entry found") {
            return res.status(404).json({ error: singleTimeEntry });
        }
        if (singleTimeEntry == "not authorized to view this entry") {
            return res.status(403).json({ error: singleTimeEntry });
        }
        return res.status(200).json(singleTimeEntry);
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
})

//delete time entry
router.delete('/timeentries/:id', authMiddleware("user", true), async (req, res) => {
    try {
        const deletedTimeEntryId = req.params.id;
        if (!isValidId(deletedTimeEntryId)) {
            return res.status(400).json({ error: "invalid id" });
        }
        const userid = res.locals.user.id;
        const result = await deleteTimeEntryService(Number(deletedTimeEntryId), userid);
        if (result == "time entry not found") {
            return res.status(404).json({ "error": result });
        }
        if (result == "not authorized to delete this entry") {
            return res.status(403).json({ "error": result });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ error: "internal error" });
    }
})

export default router;
