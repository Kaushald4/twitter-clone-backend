import mongoose from "mongoose";
import { AppError } from "../utils/AppError";

const connectDB = async () => {
    return mongoose
        .connect(process.env.DB_URI as string, { dbName: "twitterDB" })
        .then((ref) => {
            console.log("DB CONNECTED...");
            return ref;
        })
        .catch((err) => new AppError(err, 500));
};

export { connectDB };
