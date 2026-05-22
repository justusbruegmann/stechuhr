import {createUser, changeOTP, getHash, getUsers, deleteUser} from "../repository/userManagement";
import {generateRandomString} from "../utils/utils";
import {verifyPassword} from "../utils/hashing";

export async function userCreation(username:string, role: string, managerId:number) {
    //TODO: check for managerid
    //TODO: Throw errror if username is taken
    try {
        const password = generateRandomString(16);
        const user = await createUser(username,role,managerId,password);
        return user;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function OTPChange(userId:number,newPwd:string){
    try {
       const change :any = await changeOTP(userId,newPwd);
       return change;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function authUser(userId:number , password:string) {
    //TODO: add validating for PW Schema
    try {
        const hash = await getHash(userId);
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

export async function usersGet(limit :number , offset :number) {
    try {
        const users = await getUsers(limit, offset);
        return users;
    } catch (e){
        console.error(e);
        throw e;
    }
}

export async function userDelete(userId:number){
    const result = await deleteUser(userId);
    return result;
}