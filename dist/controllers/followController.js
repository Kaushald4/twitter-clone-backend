"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFollowerFollowing = exports.getFollowerFollowingById = exports.removeFollow = exports.addFollow = void 0;
const Follow_1 = require("../models/Follow");
const AppError_1 = require("../utils/AppError");
const catchAsyncError_1 = require("./../utils/catchAsyncError");
exports.addFollow = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { followingId } = req.params;
    const follow = await Follow_1.Follow.findOne({ following: followingId, follower: req.auth._id });
    if (follow) {
        follow.isEnd = false;
        await follow.save();
        return res.status(200).json({ status: "success", message: "Started Following" });
    }
    const newFollow = await Follow_1.Follow.create({
        follower: req.auth._id,
        following: followingId,
    });
    return res.status(200).json({ status: "success", message: "Started Following" });
});
exports.removeFollow = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { followingId } = req.params;
    Follow_1.Follow.updateOne({ follower: req.auth._id, following: followingId }, { $set: { isEnd: true } }, { new: true }, (error, result) => {
        if (error) {
            return next(new AppError_1.AppError("Something went wrong try again!", 500));
        }
        else {
            return res
                .status(200)
                .json({ status: "success", message: "Follower Removed!" });
        }
    });
});
exports.getFollowerFollowingById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const followers = await Follow_1.Follow.find({ following: req.user._id }).populate("following follower");
    const following = await Follow_1.Follow.find({ follower: req.user._id }).populate("follower following");
    return res.status(200).json({ status: "success", data: { followers, following } });
});
exports.getAllFollowerFollowing = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const followers = await Follow_1.Follow.find({}).populate("following follower");
    return res.status(200).json({ status: "success", data: followers });
});
