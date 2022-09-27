import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const FollowSchema = new mongoose.Schema(
    {
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
    },
    { timestamps: true }
);

const Follow = mongoose.model("Follow", FollowSchema);
export { Follow };
