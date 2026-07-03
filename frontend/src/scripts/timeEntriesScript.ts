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