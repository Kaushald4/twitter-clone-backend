"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
class Uploader {
    async upload(file) {
        return new Promise((resolve, reject) => {
            const cloudStreamUpload = cloudinary_1.v2.uploader.upload_stream({ upload_preset: "twitter_clone" }, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    const data = {
                        url: result?.secure_url,
                    };
                    resolve(data);
                }
            });
            streamifier_1.default.createReadStream(file).pipe(cloudStreamUpload);
        });
    }
}
const uploader = new Uploader();
exports.uploader = uploader;
