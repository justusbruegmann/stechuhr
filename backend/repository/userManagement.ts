import {db} from '../app'
import {users} from '../drizzle/schema';
import {hashPassword} from "../utils/hashing";
import {eq} from "drizzle-orm";


export async function createUser(username: string, role: string, managerId: number, password: string) {
    const otpFlag: boolean = true
    const pw: string = await hashPassword(password);
    const result = await db.insert(users).values({
        "username": username,
        "role": role,
        "managerid": managerId,
        "pw": pw,
        "isotp": otpFlag
    });

    return password;
}

export async function changeOTP(userId: number, newPwd: string) {
    const otpFlag: boolean = false
    const pw: string = await hashPassword(newPwd)
    const result = await db.update(users).set({"pw": pw, "isotp": otpFlag}).where(eq(users.id, userId))
    return result;
}

export async function getHash(userId: number) {
    const result = await db.select({
        pw: users.pw,
        isotp: users.isotp,
        role: users.role
    }).from(users).where(eq(users.id, userId))
    return {"hash": result[0].pw, "isotp": result[0].isotp, "role": result[0].role};

}

export async function getUsers(limit: number, offset: number) {
    const result = await db.select({
        id: users.id,
        role: users.role,
        username: users.username,
        managerid: users.managerid,

    }).from(users).limit(limit).offset(offset * limit)
    return result;
}

export async function deleteUser(userId: number) {
    const result = await db.delete(users).where(eq(users.id, userId))
    return result;
}

export async function getUserFromUserName(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
}

export async function getManagers() {
    const result = await db.select({
        username: users.username,
        role: users.role,
        id: users.id
    }).from(users).where(eq(users.role, "manager"));
    return result;
}

export async function getManagerById(managerId: number) {
    const result = await db.select({id: users.id, role: users.role}).from(users).where(eq(users.id, managerId))
    return result[0];
}

export async function updateManager(userId: number, managerId: number) {
    const result = await db.update(users).set({"managerid": managerId}).where(eq(users.id, userId))
    return result;
}

export async function updateRole(userId: number, role:string) {
    const result = await db.update(users).set({"role": role}).where(eq(users.id, userId))
    return result;
}