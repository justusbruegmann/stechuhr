import * as z from 'zod';

const requestType = z.literal(["vacation", "sick"]);

const dateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/);

export const requestsRequestParameterSchema = z.object(
    {
        userId: z
            .coerce.number()
            .positive(),
        type: requestType
            .optional(),
        startDate: dateStringSchema
            .optional(),
        endDate: dateStringSchema
            .optional(),
        remark: z.string()
            .max(512)
            .optional()
    }
)

export type requestsRequestParameter = z.infer<typeof requestsRequestParameterSchema>;