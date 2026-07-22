export default interface Notification {
    id: number;
    userId: number;
    managerId?: number;
    type: "request" | "worktime_exceeded";
    description: string;
    isRead: boolean;
    createdAt: string;
}