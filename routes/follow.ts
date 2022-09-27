import {
    addFollow,
    getAllFollowerFollowing,
    getFollowerFollowingById,
    removeFollow,
} from "./../controllers/followController";
import express from "express";
import { getUserById } from "../controllers/userController";
import { isAuthenticated } from "../middleware/auth";
const router = express();

router.param("userId", getUserById);

router.route("/follow/:followingId").post(isAuthenticated, addFollow);
router.route("/follow/:followingId").delete(isAuthenticated, removeFollow);
router.route("/follow/:userId").get(isAuthenticated, getFollowerFollowingById);
router.route("/follow").get(isAuthenticated, getAllFollowerFollowing);

export default router;
