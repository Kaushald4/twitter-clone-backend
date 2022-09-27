import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

class Uploader {
    async upload(file: Buffer) {
        return new Promise((resolve, reject) => {
            const cloudStreamUpload = cloudinary.uploader.upload_stream(
                { upload_preset: "twitter_clone" },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        const data = {
                            url: result?.secure_url,
                        };
                        resolve(data);
                    }
                }
            );
            streamifier.createReadStream(file).pipe(cloudStreamUpload);
        });
    }
}

const uploader = new Uploader();

export { uploader };
