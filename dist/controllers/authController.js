"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.finishSignup = exports.verifySignupVerification = exports.signup = exports.login = exports.loginCheck = void 0;
const catchAsyncError_1 = require("../utils/catchAsyncError");
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
const sendJwtToken_1 = require("../utils/sendJwtToken");
const email_1 = __importDefault(require("../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
const sixDigitCodeGen_1 = require("../utils/sixDigitCodeGen");
//login
exports.loginCheck = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { data } = req.body;
    let user;
    let authType;
    if (data && data.includes("@")) {
        //email
        user = await User_1.User.findByEmail(data);
        authType = "email";
    }
    else if (!isNaN(data)) {
        // phone number
        authType = "phone";
        return next(new AppError_1.AppError("Phone auth not implemented yet!", 404));
    }
    else {
        //username
        authType = "username";
        user = await User_1.User.findByUsername(data);
    }
    if (!user) {
        return next(new AppError_1.AppError(`User doesn't exist with this ${authType}: ${data}`, 404));
    }
    if (!user.isVerified) {
        const [code, hashedCode, codeExpiry] = (0, sixDigitCodeGen_1.generateVerificationCode)({ digits: 6, exp: 20 });
        user.verificationCode = hashedCode;
        user.verificationCodeExpire = codeExpiry;
        await user.save();
        const emailObj = new email_1.default(user, "");
        emailObj.sendVerificationCode(code);
    }
    return res.status(200).json({ status: "success", data: user });
});
exports.login = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email, password } = req.body;
    let user = await User_1.User.findByEmail(email);
    if (!user) {
        return next(new AppError_1.AppError("Email Doesn't exit", 404));
    }
    const isValidPass = await user.isValidPassword(password);
    if (!isValidPass) {
        return next(new AppError_1.AppError("Invalid Password", 400));
    }
    (0, sendJwtToken_1.sendJwtToken)(user, res);
});
//sign up
exports.signup = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email, dob, name } = req.body;
    let user = await User_1.User.findByEmail(email);
    if (user) {
        return res.status(409).json({
            status: "error",
            message: "User already exist with this email!",
        });
    }
    const randomUserName = crypto_1.default.randomBytes(10).toString("hex");
    const [code, hashedCode, codeExpiry] = (0, sixDigitCodeGen_1.generateVerificationCode)({ digits: 6, exp: 20 });
    user = await User_1.User.create({
        email,
        name,
        dob,
        password: "123456789",
        username: randomUserName,
        verificationCode: hashedCode,
        verificationCodeExpire: codeExpiry,
    });
    const emailObj = new email_1.default(user, "");
    emailObj.sendVerificationCode(code);
    res.status(201).json({
        status: "success",
        message: "account created successfully...",
        data: { user },
    });
});
exports.verifySignupVerification = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { verificationCode, email } = req.body;
    let user = await User_1.User.findByEmail(email);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User doesn't exist!" });
    }
    if (!user.verifySignupVerificationCode(verificationCode)) {
        return res
            .status(401)
            .json({ status: "error", message: "Invalid Code or Code Expired!" });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ status: "success", message: "Verified successfully..." });
});
exports.finishSignup = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { password, email } = req.body;
    let user = await User_1.User.findByEmail(email);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User doesn't exists!" });
    }
    if (user.isNewUser) {
        user.password = password;
        await user.save();
        return (0, sendJwtToken_1.sendJwtToken)(user, res);
    }
    res.status(200).json({ status: "success", message: "Already Verified!" });
});
exports.logout = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    res.clearCookie("token", { expires: new Date(), httpOnly: true });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
});
exports.forgotPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email } = req.body;
    const user = await User_1.User.findByEmail(email);
    if (!user) {
        return next(new AppError_1.AppError("Email does not exists!", 404));
    }
    //generate password reset token
    const passResetToken = await user.genForgotPasswordToken();
    //send token to frontend
    const URL = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${passResetToken}`;
    const mail = new email_1.default(user, URL);
    try {
        await user.save({ validateBeforeSave: false });
        await mail.sendForgotPassLink();
        return res.status(200).json({
            status: "success",
            message: "Password reset link sent successfully...",
        });
    }
    catch (e) {
        user.forgot_password_token = undefined;
        user.forgot_password_expire = undefined;
        user.pass_changed_at = undefined;
        await user.save({ validateBeforeSave: false });
    }
});
exports.resetPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await User_1.User.findOne({
        forgot_password_token: hashedToken,
        forgot_password_expire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError_1.AppError("Token Expired or Invalid Token!", 401));
    }
    user.password = password;
    user.forgot_password_expire = undefined;
    user.forgot_password_token = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        message: "Password Changed Successfully",
    });
});
