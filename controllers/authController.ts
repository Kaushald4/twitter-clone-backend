import { NextFunction, RequestX, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { sendJwtToken } from "../utils/sendJwtToken";
import Email from "../utils/email";
import crypto from "crypto";
import { IUserDocument } from "../types/user";
import { generateVerificationCode } from "../utils/sixDigitCodeGen";

//login
export const loginCheck = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const { data } = req.body;
        let user;
        let authType;

        if (data && data.includes("@")) {
            //email
            user = await User.findByEmail(data);
            authType = "email";
        } else if (!isNaN(data)) {
            // phone number
            authType = "phone";
            return next(new AppError("Phone auth not implemented yet!", 404));
        } else {
            //username
            authType = "username";
            user = await User.findByUsername(data);
        }

        if (!user) {
            return next(new AppError(`User doesn't exist with this ${authType}: ${data}`, 404));
        }

        if (!user.isVerified) {
            const [code, hashedCode, codeExpiry] = generateVerificationCode({ digits: 6, exp: 20 });
            user.verificationCode = hashedCode as string;
            user.verificationCodeExpire = codeExpiry as any;
            await user.save();
            const emailObj = new Email(user, "");
            emailObj.sendVerificationCode(code);
        }

        return res.status(200).json({ status: "success", data: user });
    }
);
export const login = catchAsyncError(async (req: RequestX, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user: IUserDocument | null = await User.findByEmail(email);

    if (!user) {
        return next(new AppError("Email Doesn't exit", 404));
    }

    const isValidPass = await user.isValidPassword(password);

    if (!isValidPass) {
        return next(new AppError("Invalid Password", 400));
    }

    sendJwtToken(user, res);
});

//sign up
export const signup = catchAsyncError(async (req: RequestX, res: Response, next: NextFunction) => {
    const { email, dob, name } = req.body;
    let user: IUserDocument = await User.findByEmail(email);

    if (user) {
        return res.status(409).json({
            status: "error",
            message: "User already exist with this email!",
        });
    }
    const randomUserName = crypto.randomBytes(10).toString("hex");
    const [code, hashedCode, codeExpiry] = generateVerificationCode({ digits: 6, exp: 20 });

    user = await User.create({
        email,
        name,
        dob,
        password: "123456789",
        username: randomUserName,
        verificationCode: hashedCode,
        verificationCodeExpire: codeExpiry,
    });
    const emailObj = new Email(user, "");
    emailObj.sendVerificationCode(code);
    res.status(201).json({
        status: "success",
        message: "account created successfully...",
        data: { user },
    });
});
export const verifySignupVerification = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const { verificationCode, email } = req.body;
        let user = await User.findByEmail(email);
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
    }
);
export const finishSignup = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const { password, email } = req.body;
        let user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User doesn't exists!" });
        }
        if (user.isNewUser) {
            user.password = password;
            await user.save();
            return sendJwtToken(user, res);
        }
        res.status(200).json({ status: "success", message: "Already Verified!" });
    }
);

export const logout = catchAsyncError(async (req: RequestX, res: Response, next: NextFunction) => {
    res.clearCookie("token", { expires: new Date(), httpOnly: true });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
});

export const forgotPassword = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return next(new AppError("Email does not exists!", 404));
        }

        //generate password reset token
        const passResetToken = await user.genForgotPasswordToken();

        //send token to frontend
        const URL = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${passResetToken}`;
        const mail = new Email(user, URL);

        try {
            await user.save({ validateBeforeSave: false });
            await mail.sendForgotPassLink();
            return res.status(200).json({
                status: "success",
                message: "Password reset link sent successfully...",
            });
        } catch (e) {
            user.forgot_password_token = undefined;
            user.forgot_password_expire = undefined;
            user.pass_changed_at = undefined;
            await user.save({ validateBeforeSave: false });
        }
    }
);

export const resetPassword = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user: IUserDocument | null = await User.findOne({
            forgot_password_token: hashedToken,
            forgot_password_expire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new AppError("Token Expired or Invalid Token!", 401));
        }
        user.password = password;
        user.forgot_password_expire = undefined;
        user.forgot_password_token = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            message: "Password Changed Successfully",
        });
    }
);
