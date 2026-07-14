export default interface Request {
    id: string;
    userId: string;
    managerId: string;
    type: "holiday" | "sick";
    fromDate: string;
    toDate: string;
    remark: string;
    isApproved: boolean;
}