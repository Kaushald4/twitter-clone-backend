import { NextFunction, Request, Response } from "express";

export const catchAsyncError = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export const catchAsyncParamsError = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction, id: string) => {
        fn(req, res, next, id).catch(next);
    };
};
