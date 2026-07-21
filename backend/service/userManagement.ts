import * as repo from "../repository/userManagement";
import {deleteSessionsOfUser} from "../repository/auth";
import {generateRandomString, isValidPassword} from "../utils/auth";
import {verifyPassword} from "../utils/hashing";
import User from "../types/users";

export async function userCreation(username: string, role: string, managerId: number, workload: number, holidays: number) {
    try {
        //check if managerId is a manager
        const manager = await repo.getManagerById(managerId);
        console.log(manager)
        if (!manager?.role || manager.role !== "manager") {
            return "manager does not exist";
        }
        const usernameCheck = await repo.getUserFromUserName(username)
        if (usernameCheck) {
            return "username exists";
        }
        //only allow user craation of role exist
        if (role === "manager" || role === "admin" || role === "user") {
            const password = generateRandomString(16);
            const user = await repo.createUser(username.toLowerCase(), role, managerId, password, workload, holidays);
            return user;
        }
        return "role does not exist";
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function passwordReset(userId: number) {
    try {
        const user = await repo.getUserById(userId);
        if (!user) {
            return "user does not exist";
        }
        const password = generateRandomString(16);
        const change = await repo.resetPassword(password, user.id);
        return password;
    } catch (e) {
        return "password reset error";
    }

}

export async function OTPChange(userId: number, newPwd: string) {
    try {
        const isValid = isValidPassword(newPwd);
        if (!isValid) {
            return "invalid password";
        }
        const change: any = await repo.changeOTP(userId, newPwd);
        return change;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function authUser(userId: number, password: string) {
    try {
        const hash = await repo.getHash(userId);
        console.log(hash);
        if (hash === 404) {
            return false;
        }
        if (!hash) {
            return null;
        }
        if (!hash.isotp || !hash.hash) {
            return null;
        }
        const isValid = await verifyPassword(password, hash.hash);
        console.log(isValid , "valid");
        return isValid;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function usersGet() {
    try {
        const users = await repo.getUsers();
        return users;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function getUserById(userId: number): Promise<User | null> {
    try {
        return await repo.getUserById(userId)
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function userDelete(userId: number) {
    const deleted = await deleteSessionsOfUser(userId);
    const result = await repo.deleteUser(userId);
    return result;
}

export async function managerGet() {
    const result = await repo.getManagers();
    return result;
}

export async function roleUpdate(userId: number, newRole: string) {
    if (newRole === "manager" || newRole === "admin" || newRole === "user") {
        const result = await repo.updateRole(userId, newRole);
        return result;
    }
    return "invalid role";
}

export async function managerUpdate(userId: number, managerId: number) {
    const manager = await repo.getManagerById(managerId);
    if (!manager) {
        return "manager does not exist";
    }
    if (manager?.role !== "manager") {
        return "is not a manager";
    }
    const result = await repo.updateManager(userId, managerId);
    return "succes";
}

export async function updateEmploymentDetails(userId: number, updateFields: {workload?: number, holidays?: number}) {
    return await repo.updateEmploymentDetails(userId, updateFields);
}

export async function getUsersForManager(managerId: number) {
    return await repo.getUsersForManager(managerId);
}