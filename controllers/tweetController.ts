import { catchAsyncError } from "./../utils/catchAsyncError";
import { NextFunction, RequestX, Response } from "express";
import { uploader } from "../utils/uploader";
import { Tweet } from "../models/Tweet";
import { AppError } from "../utils/AppError";
import { io } from "../app";

export const postTweet = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        let data: any;
        if (req.file) {
            data = await uploader.upload(req.file.buffer);
        }
        if (data) {
            const tweet = await Tweet.create({
                caption: req.body.title,
                image: data.url,
                user: req.auth._id,
            });
            await tweet.populate("user");
            return res.status(201).json({ status: "success", data: tweet });
        } else {
            const tweet = await Tweet.create({
                caption: req.body.title,
                user: req.auth._id,
            });
            await tweet.populate("user");
            return res.status(201).json({ status: "success", data: tweet });
        }
    }
);

export const getAllTweets = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const tweets = await Tweet.find({}).populate("user").sort({ createdAt: -1 });
        return res.status(200).json({ status: "success", data: tweets });
    }
);
//without socket
export const updateTweetLikes = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const io = req.app.get(`io`);

        const { tweetID } = req.params;
        const tweet = await Tweet.findById(tweetID);
        if (!tweet) {
            return next(new AppError("No tweet found", 404));
        }
        const tweetIndex = tweet.likes.indexOf(req.auth._id);
        if (tweetIndex === -1) {
            tweet.likes.push(req.auth._id);
        } else {
            tweet.likes.splice(tweetIndex, 1);
        }
        const updatedTweet = await tweet.save();

        res.status(200).json({
            status: "success",
            message: "updated likes",
            data: updatedTweet,
        });
    }
);

//for updating tweet likes in realtime
io.on("connection", (socket) => {
    socket.on("tweet_like", async (tweetID: string) => {
        const tweet = await Tweet.findById(tweetID);
        if (!tweet) {
            return socket.emit("tweet error", "No tweet found");
        }
        const tweetIndex = tweet.likes.indexOf(socket.data.user._id);
        if (tweetIndex === -1) {
            tweet.likes.push(socket.data.user._id);
        } else {
            tweet.likes.splice(tweetIndex, 1);
        }
        const updatedTweet = await tweet.save();

        io.emit("tweet_like", updatedTweet);
    });
});

// get current authenticated user tweets
export const getCurrentUserTweets = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const tweets = await Tweet.find({ user: req.auth._id });
        if (!tweets) {
            return next(new AppError("no tweets!", 200));
        }

        return res.status(200).json({ status: "success", data: tweets });
    }
);

// get current authenticated user tweets
export const getUserTweets = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const tweets = await Tweet.find({ user: req.user._id });
        if (!tweets) {
            return next(new AppError("no tweets!", 200));
        }

        return res.status(200).json({ status: "success", data: tweets });
    }
);
