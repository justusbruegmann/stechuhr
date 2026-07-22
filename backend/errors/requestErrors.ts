export class AppError extends Error {
    constructor(
        public readonly code: string,
        message: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class InvalidDateRangeError extends AppError {
    constructor() {
        super(
            "INVALID_DATE_RANGE",
            "Das Startdatum muss vor dem Enddatum liegen."
        );
    }
}

export class RequestOverlapWithTimeEntryError extends AppError {
    constructor() {
        super(
            "REQUEST_OVERLAP_WITH_TIMEENTRY",
            "Es ist bereits ein Zeiteintrag für den gewünschten Zeitraum vorhanden."
        )
    }
}

export class RequestOverlapWithRequestError extends AppError {
    constructor() {
        super(
            "REQUEST_OVERLAP_WITH_REQUEST",
            "Es ist bereits ein Antrag im gewünschten Zeitraum vorhanden."
        )
    }
}

export class UnauthorizedError extends AppError {
    constructor() {
        super(
            "UNAUTHORIZED",
            "Sie haben nicht die nötige Berechtigung."
        )
    }
}

export class NotFoundError extends AppError {
    constructor() {
        super(
            "NOT_FOUND",
            "Kein Eintrag gefunden."
        )
    }
}

export class NotEnoughHolidaysLeft extends AppError {
    constructor() {
        super(
            "NOT_ENOUGH_HOLIDAYS_LEFT",
            "Sie haben nicht genügend Urlaubstage zur Verfügung."
        )
    }
}