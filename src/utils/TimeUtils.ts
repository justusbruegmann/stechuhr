export function formatDate(date: Date): string {
    return `${String(date.getDate()).padStart(2, '0')}.${
        String(date.getMonth() + 1).padStart(2, '0')}.${
        date.getFullYear()}`
}


export function formatDateTime(date: Date): string {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}
//asd

export function formatMsTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
}


export function formatDuration(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime()
    return formatMsTime(diff)
}
