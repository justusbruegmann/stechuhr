import{ createTimeEntry, setEndTime, getTimeEntries, getSingleTimeEntry, getLastTimeEntry, deleteTimeEntry } from '../repository/timeEntriesRepository';
import { timeEntries, time_entry_type } from '../drizzle/schema';
import Holidays from 'date-holidays';

export async function createTimeEntryService(userid: number, starttime: Date, endtime: Date | undefined, type: (typeof time_entry_type.enumValues)[number]){
    //const currentDate = new Date();
    const holidays = new Holidays('DE', 'BW');
    try{
        const lastTimeEntry = (await getLastTimeEntry(userid))[0];
        if(starttime.getDay() == 0 || starttime.getDay() == 6){ //keine arbeit am wochenende
            return "not able to work on weekends";  
        }
        if(holidays.isHoliday(new Date(starttime.getFullYear(), starttime.getMonth(), starttime.getDate()))){ //keine Arbeit an Feiertagen
            return "not able to work on holidays";
        }
        if(starttime.getHours() >= 23 || starttime.getHours() < 6){ //nur arbeiten zwischen 6 und 23 Uhr möglich
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

export async function setEndTimeService(timeEntryId: number, newEndTime: Date){
    try{
        const timeEntry = (await getSingleTimeEntry(timeEntryId))[0];//-----------------------Hier muss getSingleTimeEntry hin -----
        if(timeEntry.endTime != null){//überprüfen ob es nicht schon einen endzeitpunkt gibt
            return "end time is already set";
        }
        if(timeEntry.startTime != null && timeEntry.startTime > newEndTime){ //überprüfen ob die endzeit nach der startzeit liegt
            return "end time is before start time";
        }
        const endTime = await setEndTime(timeEntryId, newEndTime);
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

export async function getSingleTimeEntryService(timeEntryId: number){
    try{
        const singleTimeEntry = await getSingleTimeEntry(timeEntryId);
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