import * as z from 'zod';
 
export const notificationPostBodySchema = z.object({
    managerId: z.number().nullable(),
    type: z.enum([
        "request",
        "worktime_exceeded"
    ]),
    description: z.string().min(1),
});

export type NotificationPostBody = z.infer<typeof notificationPostBodySchema>;

export const notificationPatchBodySchema = z.object({
    read: z.boolean(),
});

export type NotificationPatchBody = z.infer<typeof notificationPatchBodySchema>;
