const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BASE_URL) {
    throw new Error("no BASE_URL provided");
}

export async function createTimeEntry(token: string,userid: number, starttime: Date, type: string, endtime?:Date){
    const url = `${BASE_URL}/timeEntries/`;
    const headers = {
        "content-type": "application/json",
        "Authorization": token,
        "userid": `${userid}`
    };
    const body = {
        "starttime": starttime,
        "endtime": endtime,
        "type": type
    };
    const response = await fetch(url, {method:"POST", body: JSON.stringify(body), headers: headers});
    if(response.status == 400){
        return 400;
    }
    if(response.status == 401){
        return 401;
    }
    if(response.status == 201){
        return await response.json();
    }
}

export async function setEndTime(token: string, userid: number, timeEntryId: number, endtime: Date){
    const url = `${BASE_URL}/timeEntries/${timeEntryId}`;
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

export async function getTimeEntries(token: string, userid: number){
    const url = `${BASE_URL}/timeEntries/`;
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
        console.log("GET timeEntries status:", response.status, "| data:", result); //tmp
        return result;
    }
}

export async function getSingleTimeEntry(token: string, userid: number, timeEntryId: number){
    const url = `${BASE_URL}/timeEntries/${timeEntryId}`;
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
    const url = `${BASE_URL}/timeEntries/last`;
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
        console.log("GET timeLastEntry status:", response.status, "| data:", result); //tmp
        return result;
    }
}