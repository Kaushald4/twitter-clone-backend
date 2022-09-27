"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const followController_1 = require("./../controllers/followController");
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.default)();
router.param("userId", userController_1.getUserById);
router.route("/follow/:followingId").post(auth_1.isAuthenticated, followController_1.addFollow);
router.route("/follow/:followingId").delete(auth_1.isAuthenticated, followController_1.removeFollow);
router.route("/follow/:userId").get(auth_1.isAuthenticated, followController_1.getFollowerFollowingById);
router.route("/follow").get(auth_1.isAuthenticated, followController_1.getAllFollowerFollowing);
exports.default = router;
