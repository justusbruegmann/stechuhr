export type UserRole = "admin" | "manager" | "user";

type User = {
    id : number;
    username: string | null;
    role: string | null;
    managerid: number | null;
    workload: number;
    holidays: number;
}

export default User;