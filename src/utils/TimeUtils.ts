export function formatDate(date: Date) {
    return `${String(date.getDate()).padStart(2, '0')}.${
        String(date.getMonth() + 1).padStart(2, '0')}.${
        date.getFullYear()}`
}


export function formatDateTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}


export function formatMsTime(time: number | Date): string {
    let ms;

    if (time instanceof Date) {
        ms = time.getTime();
        console.log("time is a Date: " + time.toUTCString())
    } else {
        ms = time;
    }

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
}


export function formatDuration(start: Date, end: Date) {
    const diff = new Date(end.getTime() - start.getTime())
    return formatMsTime(diff)
}
