export function formatDate(date: Date) {
    return `${String(date.getDate()).padStart(2, '0')}.${
        String(date.getMonth() + 1).padStart(2, '0')}.${
        date.getFullYear()}`
}

export function formatTime(date: Date) {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}


export function formatDuration(start: Date, end: Date) {
    const diff = new Date(end.getTime() - start.getTime())
    return formatTime(diff)
}
