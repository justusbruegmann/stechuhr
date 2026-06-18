import {
    createUser, changeOTP, getHash, getUsers, deleteUser, getManagers, getManagerById, getUserFromUserName,
    updateRole, updateManager
} from "../repository/userManagement";
import {deleteSessionsOfUser} from "../repository/auth";
import {generateRandomString, isValidPassword} from "../utils/utils";
import {verifyPassword} from "../utils/hashing";

export async function userCreation(username: string, role: string, managerId: number) {
    try {
        //check if managerId is a manager
        const manager = await getManagerById(managerId);
        console.log(manager)
        if (!manager?.role || manager.role !== "manager") {
            return "manager does not exist";
        }
        const usernameCheck = await getUserFromUserName(username)
        if (usernameCheck) {
            return "username exists";
        }
        //only allow user ceration of role exist
        if (role === "manager" || role === "admin" || role === "user") {
            const password = generateRandomString(16);
            const user = await createUser(username.toLowerCase(), role, managerId, password);
            return user;
        }
        return "role does not exist";
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function OTPChange(userId: number, newPwd: string) {
    try {
        const isValid = isValidPassword(newPwd);
        if (!isValid) {
            return "invalid password";
        }
        const change: any = await changeOTP(userId, newPwd);
        return change;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function authUser(userId: number, password: string) {
    try {
        const hash = await getHash(userId);
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
        return isValid;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function usersGet(limit: number, offset: number) {
    try {
        const users = await getUsers(limit, offset);
        return users;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function userDelete(userId: number) {
    const deleted = await deleteSessionsOfUser(userId);
    const result = await deleteUser(userId);
    return result;
}

export async function managerGet() {
    const result = await getManagers();
    return result;
}

export async function roleUpdate(userId: number, newRole: string) {
    if (newRole === "manager" || newRole === "admin" || newRole === "user") {
        const result = await updateRole(userId, newRole);
        return result;
    }
    return "invalid role";
}

export async function managerUpdate(userId: number, managerId: number) {
    const manager = await getManagerById(managerId);
    if (!manager) {
        return "manager does not exist";
    }
    if (manager?.role !== "manager") {
        return "is not a manager";
    }
    const result = await updateManager(userId, managerId);
    return "succes";
}