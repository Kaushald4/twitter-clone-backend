"use strict";
// import dotenv from "dotenv";
// dotenv.config();
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const cloudinary_1 = require("./config/cloudinary");
const database_1 = require("./config/database");
// DB Connection
(0, database_1.connectDB)();
//Cloudinary Setup
(0, cloudinary_1.setupCloudinary)();
app_1.server.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`));
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 🔥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    app_1.server.close(() => {
        process.exit(1);
    });
});
process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    app_1.server.close(() => {
        console.log("💥 Process terminated!");
    });
});
