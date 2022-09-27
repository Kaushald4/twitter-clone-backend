import mongoose, { Document, Model } from "mongoose";

interface IProfilePhoto {
    image_id: string;
    image_url: string;
}
interface ICoverPhoto {
    image_id: string;
    image_url: string;
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    profile_photo: IProfilePhoto;
    cover_photo: ICoverPhoto;
    phone_no: number;
    pass_changed_at: Date | undefined;
    forgot_password_token: string | undefined;
    forgot_password_expire: number | undefined;
    username: string;
    bio: string;
    isVerified: boolean;
    isNewUser: boolean;
    dob: Date;
    verificationCode: string;
    verificationCodeExpire: Date;
    location: string;
    website: string;
    lastLoginAt: Date;
}

export interface IUserDocument extends IUser, Document {
    isValidPassword: (password: string) => Promise<boolean>;
    createJWTToken: () => string;
    genForgotPasswordToken: () => Promise<string>;
    passwordChangedAfter: (jwtTimeStamp: number) => boolean;
    verifySignupVerificationCode: (code: string) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
    findByEmail: (email: string) => Promise<IUserDocument>;
    findByUsername: (username: string) => Promise<IUserDocument>;
}
