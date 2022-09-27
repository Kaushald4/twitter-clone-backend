"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const FollowSchema = new mongoose_1.default.Schema({
    follower: {
        type: ObjectId,
        ref: "User",
    },
    following: {
        type: ObjectId,
        ref: "User",
    },
    isEnd: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Follow = mongoose_1.default.model("Follow", FollowSchema);
exports.Follow = Follow;
