import { loginCheck } from "./../controllers/authController";
import express from "express";
const router = express();
import {
    forgotPassword,
    login,
    logout,
    resetPassword,
    signup,
    finishSignup,
    verifySignupVerification,
} from "../controllers/authController";

router.route("/login").post(login);
router.route("/login-check").post(loginCheck);
router.route("/signup").post(signup);
router.route("/signup-finish").post(finishSignup);
router.route("/signup-verify").post(verifySignupVerification);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

export default router;
