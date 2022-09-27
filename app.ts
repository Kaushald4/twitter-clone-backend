import express from "express";
import cors = require("cors");
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { checkSocketAuth } from "./middleware/auth";

import globalErrorHandler from "./controllers/errorController";
const app = express();

//socket io setup
const server = createServer(app);

app.options(
    "*",
    cors({
        origin: "https://twitterr-clone.netlify.app/",
        credentials: true,
    }) as any
);

const io = new Server(server, {
    cors: { origin: ["http://localhost:5173", "https://twitterr-clone.netlify.app/"] },
});

app.set("io", io);

io.use(checkSocketAuth);

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("tweet like", () => {
        socket.emit("tweek like", "Hello");
    });
});

//middlewares
// app.use(
//     cors({
//         origin: "https://twitterr-clone.netlify.app/",
//         credentials: true,
//     })
// );
app.use(morgan("dev"));

//express middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
import authRoute from "./routes/auth";
import tweetRoute from "./routes/tweet";
import userRoute from "./routes/user";
import followRoute from "./routes/follow";

app.use("/api/v1", authRoute);
app.use("/api/v1", tweetRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", followRoute);

// Golbal Error Handler
app.use(globalErrorHandler);

export { server, io };
