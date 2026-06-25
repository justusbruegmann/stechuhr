import * as z from 'zod';

export const summaryRequestParameterSchema = z.object(
    {
        userId: z
            .string(),
        startTime: z
            .iso.datetime()
            .pipe(z.coerce.date()),
        endTime: z
            .iso.datetime()
            .optional()
            .default(() => new Date().toISOString())
            .pipe(z.coerce.date()),
    }
)

export type SummaryRequestParameter = z.infer<typeof summaryRequestParameterSchema>;
