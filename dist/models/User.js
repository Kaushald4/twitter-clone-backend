"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        maxlength: [50, "name must be less than 50 char"],
        required: [true, "please provide name"],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        maxlength: [50, "name must be less than 50 char"],
        required: [true, "please provide email"],
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        maxlength: [50, "name must be less than 50 char"],
        required: [true, "please provide email"],
        trim: true,
        lowercase: true,
    },
    location: String,
    website: String,
    lastLoginAt: Date,
    isVerified: {
        type: Boolean,
        default: false,
    },
    isNewUser: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        required: [true, "please provide password"],
    },
    profile_photo: {
        image_id: String,
        image_url: String,
    },
    cover_photo: {
        image_id: String,
        image_url: String,
    },
    phone_no: {
        type: Number,
    },
    verificationCode: String,
    verificationCodeExpire: Date,
    bio: {
        type: String,
        maxLength: [100, "bio must be less than 100 char"],
        trim: true,
        lowercase: true,
    },
    dob: {
        type: Date,
    },
    pass_changed_at: Date,
    forgot_password_token: String,
    forgot_password_expire: Number,
}, { timestamps: true });
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    this.pass_changed_at = new Date(Date.now() - 1000);
    next();
});
//validate that given password is correct or not
UserSchema.methods.isValidPassword = async function (plainPassword) {
    return await bcryptjs_1.default.compare(plainPassword, this.password);
};
//create and return JWT token
UserSchema.methods.createJWTToken = function () {
    const token = jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });
    return token;
};
UserSchema.methods.genForgotPasswordToken = async function () {
    const token = crypto_1.default.randomBytes(20).toString("hex");
    //save hashed version of token in DB
    this.forgot_password_token = crypto_1.default.createHash("sha256").update(token).digest("hex");
    //time of token (20min)
    this.forgot_password_expire = Date.now() + 20 * 60 * 1000;
    this.pass_changed_at = new Date(Date.now() - 1000);
    return token;
};
UserSchema.methods.verifySignupVerificationCode = function (verificationCode) {
    const hashedCode = crypto_1.default.createHash("sha256").update(verificationCode).digest("hex");
    if (this.verificationCodeExpire < Date.now()) {
        return false;
    }
    if (hashedCode !== this.verificationCode) {
        return false;
    }
    this.verificationCodeExpire = undefined;
    this.verificationCode = undefined;
    return true;
};
UserSchema.methods.passwordChangedAfter = function (jwtTimeStamp) {
    console.log(this.pass_changed_at);
    if (this.pass_changed_at) {
        const changedTimeStamp = Math.floor(this.pass_changed_at.getTime() / 1000);
        return jwtTimeStamp < changedTimeStamp;
    }
    return false;
};
UserSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};
UserSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });
};
const User = mongoose_1.default.model("User", UserSchema);
exports.User = User;
