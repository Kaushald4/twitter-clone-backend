"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendJwtToken = void 0;
const sendJwtToken = (user, res) => {
    const jwtToken = user.createJWTToken();
    const cookieTime = parseInt(process.env.COOKIE_TIME);
    const options = {
        expires: new Date(Date.now() + cookieTime * 24 * 60 * 60 * 1000),
        secure: true,
        SameSite: "None",
    };
    //set token in cookie
    res.status(200)
        .cookie("token", jwtToken, {
        sameSite: "none",
        expires: new Date(Date.now() + cookieTime * 24 * 60 * 60 * 1000),
        secure: true,
    })
        .json({ status: "success", data: { jwtToken, user } });
};
exports.sendJwtToken = sendJwtToken;
