//TODO: make auth funtion that takes is id and token and the role that is needed
import {auth} from "../service/auth";


export async function authHelper(token: string, id: number, neededRole: string) {
    if (token && id) {
        const authUser = await auth(undefined,undefined,token,id);
        if (!authUser) {
            return {"authorized": false, "data":{"id": null, "role":null}};
        }
        if (authUser.succes) {
            if (neededRole === authUser.role) {
                return {"authorized": true, "data": {"id": id, "role": authUser.role}};
            }
            return {"authorized": false, "data": {"id": null, "role": null}}
        }
        return {"authorized": false, "data":{ "id": null, "role": null}}
    }
    return {"authorized": false, "data":{ "id": null, "role": null}}
}