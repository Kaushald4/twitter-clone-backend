"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("./../controllers/authController");
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const authController_2 = require("../controllers/authController");
router.route("/login").post(authController_2.login);
router.route("/login-check").post(authController_1.loginCheck);
router.route("/signup").post(authController_2.signup);
router.route("/signup-finish").post(authController_2.finishSignup);
router.route("/signup-verify").post(authController_2.verifySignupVerification);
router.route("/logout").get(authController_2.logout);
router.route("/forgot-password").post(authController_2.forgotPassword);
router.route("/reset-password/:token").post(authController_2.resetPassword);
exports.default = router;
