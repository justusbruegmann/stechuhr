import{ createTimeEntry, setEndTime, getTimeEntries, getSingleTimeEntry, getLastTimeEntry, deleteTimeEntry } from '../repository/timeEntriesRepository';
import { time_entry_type } from '../drizzle/schema';
import Holidays from 'date-holidays';
import { DateString } from '../types/misc';
import { TimeEntry } from '../types/timeEntry';

export async function createTimeEntryService(userid: number, starttime: Date, endtime: Date | undefined, type: (typeof time_entry_type.enumValues)[number]){
    const holidays = new Holidays('DE', 'BW');
    try{
        const lastTimeEntry = (await getLastTimeEntry(userid))[0];
        if(starttime.getDay() == 0 || starttime.getDay() == 6){ //no work on weekends
            return "not able to work on weekends";
        }
        if(holidays.isHoliday(new Date(starttime.getFullYear(), starttime.getMonth(), starttime.getDate()))){ //no work on holidays 
            return "not able to work on holidays";
        }
        if(starttime.getHours() >= 23 || starttime.getHours() < 6){ //only possible work between 6 and 23 o'clock
            return "out of working time";    
        }
        if(lastTimeEntry && lastTimeEntry.endTime == null){ //show if last time entry has an end time
            return "last time entry has no endtime";     
        }       
        if(endtime && endtime < starttime){  //look if endtime is before starttime
            return "endtime is before starttime";
        }
        const timeEntry = await createTimeEntry(userid, starttime, type, endtime);
        return timeEntry;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}

export async function setEndTimeService(timeEntryId: number, newEndTime: Date, userid: number){
    try{
        const timeEntry = (await getSingleTimeEntry(timeEntryId))[0];
        if(!timeEntry){
            return "time entry not found";
        }
        if(timeEntry.userId !== userid){
            return "not authorized to modify this entry";
        }
        if(timeEntry.endTime != null){
            return "end time is already set";
        }
        if(timeEntry.startTime != null && timeEntry.startTime > newEndTime){
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

export async function getTimeEntriesService(userid: number, type?: "work" | "holiday" | "sick", startDate?: DateString, endDate?: DateString) : Promise<TimeEntry[] | string>{
    try{
        const end = endDate ? endDate+"T23:59:59" : undefined;
        if(startDate && end && startDate > end){
            return "end date is before start date";
        }
        const timeEntries = await getTimeEntries(userid, type, startDate, end);
        return timeEntries;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}

export async function getSingleTimeEntryService(timeEntryId: number, userid: number){
    try{
        const singleTimeEntry = (await getSingleTimeEntry(timeEntryId))[0];
        if(!singleTimeEntry){
            return "no time entry found";
        }
        if(singleTimeEntry.userId != userid){
            return "not authorized to view this entry";
        }
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

export async function deleteTimeEntryService(timeEntryId: number, userid: number){
    try{
        const timeEntry = (await getSingleTimeEntry(timeEntryId))[0];
        if(!timeEntry){
            return "time entry not found";
        }
        if(timeEntry.userId !== userid){
            return "not authorized to delete this entry";
        }
        const deleted = await deleteTimeEntry(timeEntryId);
        return deleted;
    }
    catch(e){
        console.error(e);
        throw e;
    }
}
