import * as z from 'zod';

export const employmentRequestSchema = z.object(
    {
        workload: z
            .coerce.number()
            .min(0)
            .max(168)
            .optional(),
        holidays: z
            .coerce.number()
            .min(0)
            .max(366)
            .optional(),
    }
)

export type EmploymentRequest = z.infer<typeof employmentRequestSchema>;
