export default interface TimeEntry {
    /**
     * A TimeEntry represents one logged time for a user.
     * Timestamps use the ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ
     *
     * The endTime must not be set if it represents a working period that is still ongoing.
     */

    id: number;
    userId: number;
    startTime: string;
    endTime?: string;
}