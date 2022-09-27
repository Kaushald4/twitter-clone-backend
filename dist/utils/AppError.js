"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStatus = exports.AppError = exports.errorStatusEnumMap = void 0;
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus[ErrorStatus["error"] = 0] = "error";
    ErrorStatus[ErrorStatus["fail"] = 1] = "fail";
})(ErrorStatus || (ErrorStatus = {}));
exports.ErrorStatus = ErrorStatus;
const errorStatusEnumMap = (errorStatus) => {
    switch (errorStatus) {
        case ErrorStatus.error:
            return "error";
        case ErrorStatus.fail:
            return "fail";
    }
};
exports.errorStatusEnumMap = errorStatusEnumMap;
/**
 * global error class
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = `${statusCode}`.startsWith("4")
            ? (0, exports.errorStatusEnumMap)(ErrorStatus.error)
            : (0, exports.errorStatusEnumMap)(ErrorStatus.fail);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
