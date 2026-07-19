import * as z from 'zod';

const requestType = z.literal(["holiday", "sick"]);

const dateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/);

export const getRequestsRequestParameterSchema = z.object(
    {
        userId: z
            .coerce.number()
            .positive()
    }
)

export type getRequestsRequestParameter = z.infer<typeof getRequestsRequestParameterSchema>;

export const requestsRequestParameterSchema = z.object(
    {
        type: requestType,
        startDate: dateStringSchema,
        endDate: dateStringSchema,
        remark: z.string()
            .max(512)
            .optional()
    }
)

export type requestsRequestParameter = z.infer<typeof requestsRequestParameterSchema>;

export const updateRequestsRequestBodySchema = z.object({
    approved: z.boolean().nullable().optional()
});

export type UpdateRequestBody = z.infer<typeof updateRequestsRequestBodySchema>;