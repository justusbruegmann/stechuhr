export default interface Notification {
    id: number;
    userId: number;
    managerId?: number;
    type: "info" | "warning" | "error";
    description: string;
    isRead: boolean;
    createdAt: string;
}