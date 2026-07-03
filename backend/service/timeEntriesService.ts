import{ createTimeEntry, setEndTime, getTimeEntries, getSingleTimeEntry, getLastTimeEntry, deleteTimeEntry } from '../repository/timeEntriesRepository';
import { timeEntries, time_entry_type } from '../drizzle/schema';

export async function createTimeEntryService(userid: number, starttime: Date, endtime: Date | undefined, type: (typeof time_entry_type.enumValues)[number]){
    const currentDate = new Date();
    try{
        const lastTimeEntry = (await getLastTimeEntry(userid))[0];
        if(currentDate.getDay() == 0 || currentDate.getDay() == 6){ //keine arbeit am wochenende
            return "not able to work on weekends";  
        }
        if(currentDate.getHours() >= 23 || currentDate.getHours() < 6){ //nur arbeiten zwischen 6 und 23 Uhr möglich
            return "out of working time";    
        }
        if(lastTimeEntry.endTime == null){ //überprüfen ob letzter Eintrag für den Benutzer noch kein Endzeitpunkt hat
            return "last time entry has no end time";     
        }         
        const timeEntry = await createTimeEntry(userid, starttime, type, endtime);
        return timeEntry;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}

export async function setEndTimeService(timeEntryId: number, endtime: Date){
    const timeEntry = (await getSingleTimeEntry(timeEntryId))[0];
    try{
        if(timeEntry.endTime != null){//überprüfen ob es nicht schon einen endzeitpunkt gibt
            return "end time is already set";
        }
        if(timeEntry.startTime != null && timeEntry.startTime > endtime){ //überprüfen ob die endzeit nach der startzeit liegt
            return "end time is before start time";
        }
        const endTime = await setEndTime(timeEntryId, endtime);
        return endTime;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}

export async function getTimeEntriesService(userid: number){
    try{
        const timeEntries = await getTimeEntries(userid);
        return timeEntries;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}

export async function getSingleTimeEntryService(userid: number){
    try{
        const singleTimeEntry = await getSingleTimeEntry(userid);
        return singleTimeEntry;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}

export async function getLastTimeEntryService(userid:number){
    try{
        const lastTimeEntry = await getLastTimeEntry(userid);
        return lastTimeEntry;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}

export async function deleteTimeEntryService(timeEntryId: number){
    try{
        const deleted = await deleteTimeEntry(timeEntryId);
        return deleted;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}