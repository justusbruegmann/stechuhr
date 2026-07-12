import * as z from 'zod';

export const summaryRequestParameterSchema = z.object(
    {
        userId: z
            .coerce.number(),
        startDate: z
            .iso.date(),
        endDate: z
            .iso.date()
            .optional()
            .default(() => new Date().toISOString().slice(0, 10)),
    }
)

export type SummaryRequestParameter = z.infer<typeof summaryRequestParameterSchema>;
