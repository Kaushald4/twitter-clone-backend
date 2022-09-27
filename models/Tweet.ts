import mongoose, { Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const TweetSchema = new Schema(
    {
        caption: String,
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
    },
    { timestamps: true }
);

const Tweet = mongoose.model("Tweet", TweetSchema);
export { Tweet };
