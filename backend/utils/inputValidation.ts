import {z} from "zod";
import {DateString} from "../types/misc";
import {generateTodayDateString} from "./timeUtils";


export function isValidUserId(userId: any) {
    const userIdSchema = z.coerce.number().int().positive();

    try {
        userIdSchema.parse(userId);
        return true;
    } catch (e) {
        return false;
    }
}


export function isStartDateEarlierThanEndDate(startDate: DateString, endDate: DateString) {
    return startDate < endDate;
}


export function isDateInCorrectTimeframe (date: DateString){
    const y2k = "2000-01-01";
    const today = generateTodayDateString();
    return y2k <= date && date <= today;
}
