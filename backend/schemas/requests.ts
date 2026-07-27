import * as z from 'zod';

const requestType = z.literal(["holiday", "sick"]);

const dateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/);

export const getRequestsRequestParameterSchema = z.object(
    {
        userId: z
            .coerce.number()
            .positive(),
        startDate: dateStringSchema.optional(),
        endDate: dateStringSchema.optional(),
        type: requestType.optional()
    }
)

export type getRequestsRequestParameter = z.infer<typeof getRequestsRequestParameterSchema>;

export const requestsRequestBodySchema = z.object(
    {
        type: requestType,
        startDate: dateStringSchema,
        endDate: dateStringSchema,
        remark: z.string()
            .max(512)
            .nullable()
            .optional()
    }
)

export type requestsRequestBody = z.infer<typeof requestsRequestBodySchema>;

export const updateRequestsRequestBodySchema = z.object({
    approved: z.boolean().nullable().optional()
});

export type UpdateRequestBody = z.infer<typeof updateRequestsRequestBodySchema>;