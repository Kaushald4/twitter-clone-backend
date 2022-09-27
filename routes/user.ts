import express from "express";
import multer from "multer";
import { getUserInfo, updateCurrentUser, getUserById } from "./../controllers/userController";
import { isAuthenticated } from "../middleware/auth";
import { getCurrentAuthenticatedUser } from "../controllers/userController";
const router = express();
const upload = multer();

router.param("userId", getUserById);

router.route("/user").get(isAuthenticated, getCurrentAuthenticatedUser);
router.route("/user").patch(
    isAuthenticated,
    upload.fields([
        { name: "profile", maxCount: 1 },
        { name: "cover", maxCount: 1 },
    ]),
    updateCurrentUser
);
router.route("/user/:userId").get(isAuthenticated, getUserInfo);

export default router;
