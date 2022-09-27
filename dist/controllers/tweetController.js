"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTweets = exports.getCurrentUserTweets = exports.updateTweetLikes = exports.getAllTweets = exports.postTweet = void 0;
const catchAsyncError_1 = require("./../utils/catchAsyncError");
const uploader_1 = require("../utils/uploader");
const Tweet_1 = require("../models/Tweet");
const AppError_1 = require("../utils/AppError");
const app_1 = require("../app");
exports.postTweet = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    let data;
    if (req.file) {
        data = await uploader_1.uploader.upload(req.file.buffer);
    }
    if (data) {
        const tweet = await Tweet_1.Tweet.create({
            caption: req.body.title,
            image: data.url,
            user: req.auth._id,
        });
        await tweet.populate("user");
        return res.status(201).json({ status: "success", data: tweet });
    }
    else {
        const tweet = await Tweet_1.Tweet.create({
            caption: req.body.title,
            user: req.auth._id,
        });
        await tweet.populate("user");
        return res.status(201).json({ status: "success", data: tweet });
    }
});
exports.getAllTweets = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const tweets = await Tweet_1.Tweet.find({}).populate("user").sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: tweets });
});
//without socket
exports.updateTweetLikes = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const io = req.app.get(`io`);
    const { tweetID } = req.params;
    const tweet = await Tweet_1.Tweet.findById(tweetID);
    if (!tweet) {
        return next(new AppError_1.AppError("No tweet found", 404));
    }
    const tweetIndex = tweet.likes.indexOf(req.auth._id);
    if (tweetIndex === -1) {
        tweet.likes.push(req.auth._id);
    }
    else {
        tweet.likes.splice(tweetIndex, 1);
    }
    const updatedTweet = await tweet.save();
    res.status(200).json({
        status: "success",
        message: "updated likes",
        data: updatedTweet,
    });
});
//for updating tweet likes in realtime
app_1.io.on("connection", (socket) => {
    socket.on("tweet_like", async (tweetID) => {
        const tweet = await Tweet_1.Tweet.findById(tweetID);
        if (!tweet) {
            return socket.emit("tweet error", "No tweet found");
        }
        const tweetIndex = tweet.likes.indexOf(socket.data.user._id);
        if (tweetIndex === -1) {
            tweet.likes.push(socket.data.user._id);
        }
        else {
            tweet.likes.splice(tweetIndex, 1);
        }
        const updatedTweet = await tweet.save();
        app_1.io.emit("tweet_like", updatedTweet);
    });
});
// get current authenticated user tweets
exports.getCurrentUserTweets = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const tweets = await Tweet_1.Tweet.find({ user: req.auth._id });
    if (!tweets) {
        return next(new AppError_1.AppError("no tweets!", 200));
    }
    return res.status(200).json({ status: "success", data: tweets });
});
// get current authenticated user tweets
exports.getUserTweets = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const tweets = await Tweet_1.Tweet.find({ user: req.user._id });
    if (!tweets) {
        return next(new AppError_1.AppError("no tweets!", 200));
    }
    return res.status(200).json({ status: "success", data: tweets });
});
