"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.updateCurrentUser = exports.getCurrentAuthenticatedUser = exports.getUserById = void 0;
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
const uploader_1 = require("../utils/uploader");
const catchAsyncError_1 = require("./../utils/catchAsyncError");
//middleware
exports.getUserById = (0, catchAsyncError_1.catchAsyncParamsError)(async (req, res, next, id) => {
    const user = await User_1.User.findById(id);
    if (!user) {
        return next(new AppError_1.AppError("user no longer exits!", 404));
    }
    req.user = user;
    next();
});
exports.getCurrentAuthenticatedUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    if (req.auth) {
        return res.status(200).json({ status: "success", data: req.auth });
    }
    else {
        return next(new AppError_1.AppError("Invalid token! Login again", 401));
    }
});
exports.updateCurrentUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    let profile;
    let cover;
    if (req.files["profile"]) {
        profile = await uploader_1.uploader.upload(req.files["profile"][0].buffer);
    }
    if (req.files["cover"]) {
        cover = await uploader_1.uploader.upload(req.files["cover"][0].buffer);
    }
    const update = { $set: {} };
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
    User_1.User.updateOne({ _id: req.auth._id }, update, { new: true }, (error, result) => {
        if (error) {
            return res.status(500).json({ status: "error", message: error.mesage });
        }
        return res.status(200).json({ status: "success", data: result });
    });
});
exports.getUserInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const user = await User_1.User.findById(req.user._id);
    return res.status(200).json({ status: "success", data: user });
});
