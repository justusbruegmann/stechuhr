import * as z from 'zod';

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
            .default(() => new Date().toISOString().slice(0, 10)),
    }
)

export type SummaryRequestParameter = z.infer<typeof summaryRequestParameterSchema>;
