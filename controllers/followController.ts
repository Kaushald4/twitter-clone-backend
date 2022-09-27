import { Response, RequestX, NextFunction } from "express";
import { io } from "../app";
import { Follow } from "../models/Follow";
import { AppError } from "../utils/AppError";
import { catchAsyncError } from "./../utils/catchAsyncError";

export const addFollow = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const { followingId } = req.params;

        const follow = await Follow.findOne({ following: followingId, follower: req.auth._id });

        if (follow) {
            follow.isEnd = false;
            await follow.save();
            return res.status(200).json({ status: "success", message: "Started Following" });
        }

        const newFollow = await Follow.create({
            follower: req.auth._id,
            following: followingId,
        });

        return res.status(200).json({ status: "success", message: "Started Following" });
    }
);

export const removeFollow = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const { followingId } = req.params;

        Follow.updateOne(
            { follower: req.auth._id, following: followingId },
            { $set: { isEnd: true } },
            { new: true },
            (error, result) => {
                if (error) {
                    return next(new AppError("Something went wrong try again!", 500));
                } else {
                    return res
                        .status(200)
                        .json({ status: "success", message: "Follower Removed!" });
                }
            }
        );
    }
);

export const getFollowerFollowingById = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const followers = await Follow.find({ following: req.user._id }).populate(
            "following follower"
        );
        const following = await Follow.find({ follower: req.user._id }).populate(
            "follower following"
        );

        return res.status(200).json({ status: "success", data: { followers, following } });
    }
);

export const getAllFollowerFollowing = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const followers = await Follow.find({}).populate("following follower");

        return res.status(200).json({ status: "success", data: followers });
    }
);
