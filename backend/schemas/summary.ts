import * as z from 'zod';
import {generateTodayDateString} from "../utils/timeUtils";

const dateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/);

export const summaryRequestParameterSchema = z.object(
    {
        userId: z
            .coerce.number()
            .positive(),
        startDate: dateStringSchema,
        endDate: dateStringSchema
            .optional()
            .default(() => generateTodayDateString()),
    }
)

export type SummaryRequestParameter = z.infer<typeof summaryRequestParameterSchema>;
