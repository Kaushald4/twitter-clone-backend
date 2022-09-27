import { Response, RequestX, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { uploader } from "../utils/uploader";
import { catchAsyncError, catchAsyncParamsError } from "./../utils/catchAsyncError";

//middleware
export const getUserById = catchAsyncParamsError(
    async (req: RequestX, res: Response, next: NextFunction, id: string) => {
        const user = await User.findById(id);
        if (!user) {
            return next(new AppError("user no longer exits!", 404));
        }
        req.user = user;
        next();
    }
);

export const getCurrentAuthenticatedUser = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        if (req.auth) {
            return res.status(200).json({ status: "success", data: req.auth });
        } else {
            return next(new AppError("Invalid token! Login again", 401));
        }
    }
);

export const updateCurrentUser = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        let profile: any;
        let cover: any;
        if (req.files["profile"]) {
            profile = await uploader.upload(req.files["profile"][0].buffer);
        }
        if (req.files["cover"]) {
            cover = await uploader.upload(req.files["cover"][0].buffer);
        }

        const update: any = { $set: {} };

        if (!profile) {
            update.$set["isNewUser"] = false;
        }

        for (let param in req.body) {
            update.$set[param] = req.body[param];
        }
        if (profile) {
            update["profile_photo"] = profile.url;
        }
        if (cover) {
            update["cover_photo"] = cover.url;
        }

        User.updateOne({ _id: req.auth._id }, update, { new: true }, (error: any, result) => {
            if (error) {
                return res.status(500).json({ status: "error", message: error.mesage });
            }
            return res.status(200).json({ status: "success", data: result });
        });
    }
);

export const getUserInfo = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const user = await User.findById(req.user._id);

        return res.status(200).json({ status: "success", data: user });
    }
);
