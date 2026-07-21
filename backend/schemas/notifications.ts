import * as z from 'zod';

export const notificationPostBodySchema = z.object({
    date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "invalid date",
    }),
});

export type NotificationPostBody = z.infer<typeof notificationPostBodySchema>;

export const notificationPatchBodySchema = z.object({
    read: z.boolean(),
});

export type NotificationPatchBody = z.infer<typeof notificationPatchBodySchema>;