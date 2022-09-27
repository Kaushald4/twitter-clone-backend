import express from "express";
import multer from "multer";
import {
    getAllTweets,
    getCurrentUserTweets,
    getUserTweets,
    postTweet,
    updateTweetLikes,
} from "./../controllers/tweetController";
import { getUserById } from "../controllers/userController";
import { isAuthenticated } from "../middleware/auth";
const router = express();
const upload = multer();

router.param("userId", getUserById);

router.route("/tweet/post").post(isAuthenticated, upload.single("post"), postTweet);
router.route("/tweets").get(isAuthenticated, getAllTweets);
router.route("/tweets/likes/inc/:tweetID").put(isAuthenticated, updateTweetLikes);
router.route("/tweets/user").get(isAuthenticated, getCurrentUserTweets);
router.route("/tweets/user/:userId").get(isAuthenticated, getUserTweets);

export default router;
