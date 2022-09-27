import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new Schema({
    tweet: {
        type: ObjectId,
        ref: "Comment",
    },
    text: {
        type: String,
    },
    likes: [
        {
            type: ObjectId,
            ref: "User",
        },
    ],
    image: {
        type: String,
    },
    isRetweet: {
        type: Boolean,
        default: false,
    },
    user: {
        type: ObjectId,
        ref: "User",
    },
});

const Comment = mongoose.model("Comment", CommentSchema);
export { Comment };
