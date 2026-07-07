export default interface Request {
    id: string;
    userId: string;
    managerId: string;
    type: "Vacation" | "Sick";
    fromDate: string;
    toDate: string;
    isApproved: boolean;
}