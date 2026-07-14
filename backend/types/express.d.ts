import {SummaryRequestParameter} from "../schemas/summary";

export type AuthUser = {
    id: number;
    role: string;
};

declare global {
    namespace Express {
        interface Locals {
            user: AuthUser;
        }
    }
}