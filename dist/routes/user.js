"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("./../controllers/userController");
const auth_1 = require("../middleware/auth");
const userController_2 = require("../controllers/userController");
const router = (0, express_1.default)();
const upload = (0, multer_1.default)();
router.param("userId", userController_1.getUserById);
router.route("/user").get(auth_1.isAuthenticated, userController_2.getCurrentAuthenticatedUser);
router.route("/user").patch(auth_1.isAuthenticated, upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
]), userController_1.updateCurrentUser);
router.route("/user/:userId").get(auth_1.isAuthenticated, userController_1.getUserInfo);
exports.default = router;
