"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = require("./middleware/auth");
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
//socket io setup
const server = (0, http_1.createServer)(app);
exports.server = server;
app.options("*", cors({
    origin: "https://twitterr-clone.netlify.app/",
    credentials: true,
}));
const io = new socket_io_1.Server(server, {
    cors: { origin: ["http://localhost:5173", "https://twitterr-clone.netlify.app/"] },
});
exports.io = io;
app.set("io", io);
io.use(auth_1.checkSocketAuth);
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
app.use((0, morgan_1.default)("dev"));
//express middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//routes
const auth_2 = __importDefault(require("./routes/auth"));
const tweet_1 = __importDefault(require("./routes/tweet"));
const user_1 = __importDefault(require("./routes/user"));
const follow_1 = __importDefault(require("./routes/follow"));
app.use("/api/v1", auth_2.default);
app.use("/api/v1", tweet_1.default);
app.use("/api/v1", user_1.default);
app.use("/api/v1", follow_1.default);
// Golbal Error Handler
app.use(errorController_1.default);
