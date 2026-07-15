import { error } from "node:console";

const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function createTimeEntry(token: string,userid: number, startTime: Date, type: "work" | "holiday" | "sick", endTime?:Date){
    const url = `${BASE_URL}/timeentries/`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userid}`
    };
    const body = {
        "starttime": startTime,
        "endtime": endTime,
        "type": type
    };
    const response = await fetch(url, {method:"POST", body: JSON.stringify(body), headers: headers});
    const text = await response.json();
    if(text.error === "Admins are not allowed to clock in."){
        return {error: text.error};
    }
    if(response.status == 400){
        return 400;
    }
    if(response.status == 401){
        return 401;
    }
    if(response.status == 201){
        return text;
    }
}

export async function setEndTime(token: string, userid: number, timeEntryId: number, endtime: Date){
    const url = `${BASE_URL}/timeentries/${timeEntryId}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userid}`
    };
    const body = {
        "endtime": endtime
    };
    const response = await fetch(url, {method:"PATCH", body: JSON.stringify(body), headers: headers});
    if(response.status == 400){
        return 400;
    }
    if(response.status == 401){
        return 401;
    }
    if(response.status == 200){
        return await response.json();
    }
}

export async function getTimeEntries(token: string, userid: number, type?: "work"|"holiday"|"sick", startDate?: string, endDate?: string){
    const params = new URLSearchParams();
    if(type){
        params.append("type", type);
    }
    if (startDate){
        params.append("startDate", startDate);
    } 
    if (endDate){
        params.append("endDate", endDate);
    }
    const url = `${BASE_URL}/users/${userid}/timeentries?${params.toString()}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userid}`
    };
    const response = await fetch(url, {method:"GET", headers: headers});
    if(response.status == 400){
        return 400;
    }
    if(response.status == 401){
        return 401;
    }
    if(response.status == 200){
        const result = await response.json();
        return result;
    }
}

export async function getSingleTimeEntry(token: string, userid: number, timeEntryId: number){
    const url = `${BASE_URL}/timeentries/${timeEntryId}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userid}`
    };
    const response = await fetch(url, {method:"GET", headers: headers})
    if(response.status == 400){
        return 400;
    }
    if(response.status == 401){
        return 401;
    }
    if(response.status == 200){
        const result = await response.json();
        return result;
    }
}

export async function getLastTimeEntry(token: string, userid: number){
    const url = `${BASE_URL}/timeentries/last`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userid}`
    };
    const response = await fetch(url, {method:"GET", headers: headers})
    if(response.status == 400){
        return 400;
    }
    if(response.status == 401){
        return 401;
    }
    if(response.status == 200){
        const result = await response.json();
        return result;
    }
}

export async function deleteTimeEntry(token: string, userid: number, timeEntryId: number){
    const url = `${BASE_URL}/timeentries/${timeEntryId}`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userid}`
    };
    const response = await fetch(url, {method:"DELETE", headers: headers});
    if(response.status == 400){
        return 400;
    }
    if(response.status == 401){
        return 401;
    }
    if(response.status == 200){
       return 200;
    }
}

//
