enum ErrorStatus {
    error,
    fail,
}

export const errorStatusEnumMap = (errorStatus: ErrorStatus) => {
    switch (errorStatus) {
        case ErrorStatus.error:
            return "error";
        case ErrorStatus.fail:
            return "fail";
    }
};

/**
 * global error class
 */
class AppError extends Error {
    readonly statusCode: number;
    readonly status: string;
    readonly isOperational: Boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        this.status = `${statusCode}`.startsWith("4")
            ? errorStatusEnumMap(ErrorStatus.error)
            : errorStatusEnumMap(ErrorStatus.fail);

        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError, ErrorStatus };
