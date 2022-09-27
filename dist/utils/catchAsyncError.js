"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncParamsError = exports.catchAsyncError = void 0;
const catchAsyncError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsyncError = catchAsyncError;
const catchAsyncParamsError = (fn) => {
    return (req, res, next, id) => {
        fn(req, res, next, id).catch(next);
    };
};
exports.catchAsyncParamsError = catchAsyncParamsError;
