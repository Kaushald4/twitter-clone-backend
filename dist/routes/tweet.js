"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const tweetController_1 = require("./../controllers/tweetController");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.default)();
const upload = (0, multer_1.default)();
router.param("userId", userController_1.getUserById);
router.route("/tweet/post").post(auth_1.isAuthenticated, upload.single("post"), tweetController_1.postTweet);
router.route("/tweets").get(auth_1.isAuthenticated, tweetController_1.getAllTweets);
router.route("/tweets/likes/inc/:tweetID").put(auth_1.isAuthenticated, tweetController_1.updateTweetLikes);
router.route("/tweets/user").get(auth_1.isAuthenticated, tweetController_1.getCurrentUserTweets);
router.route("/tweets/user/:userId").get(auth_1.isAuthenticated, tweetController_1.getUserTweets);
exports.default = router;
