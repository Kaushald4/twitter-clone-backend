"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSocketAuth = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
const catchAsyncError_1 = require("../utils/catchAsyncError");
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    let token = req.cookies.token || req.headers.authorization?.replace("Bearer", "").trim();
    if (!token) {
        return next(new AppError_1.AppError("Invalid token! Login again", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await User_1.User.findById(decoded.id);
    if (!user) {
        return next(new AppError_1.AppError("User no longer exists!", 401));
    }
    const isUserChangedPassword = user.passwordChangedAfter(decoded.iat);
    if (isUserChangedPassword) {
        res.clearCookie("token", { expires: new Date(), httpOnly: true });
        return next(new AppError_1.AppError("Password recently changed login again!", 401));
    }
    req.auth = user;
    return next();
});
//socket io auth
const checkSocketAuth = async (socket, next) => {
    let token = socket.handshake.auth.token;
    if (!token) {
        return next(new AppError_1.AppError("Invalid token! Login again", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await User_1.User.findById(decoded.id);
    if (!user) {
        return next(new AppError_1.AppError("User no longer exists!", 401));
    }
    const isUserChangedPassword = user.passwordChangedAfter(decoded.iat);
    if (isUserChangedPassword) {
        return next(new AppError_1.AppError("Password recently changed login again!", 401));
    }
    socket.data.user = user;
    return next();
};
exports.checkSocketAuth = checkSocketAuth;
