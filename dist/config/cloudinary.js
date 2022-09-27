"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const setupCloudinary = () => {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
};
exports.setupCloudinary = setupCloudinary;
