import * as z from 'zod';

export const notificationPostBodySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "invalid date format, expected YYYY-MM-DD"
    }),
});

export type NotificationPostBody = z.infer<typeof notificationPostBodySchema>;

export const notificationPatchBodySchema = z.object({
    read: z.boolean(),
});

export type NotificationPatchBody = z.infer<typeof notificationPatchBodySchema>;