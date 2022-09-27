import { Response } from "express";
import { IUserDocument } from "../types/user";

const sendJwtToken = (user: IUserDocument, res: Response) => {
    const jwtToken = user.createJWTToken();
    const cookieTime = parseInt(process.env.COOKIE_TIME as string);
    const options = {
        expires: new Date(Date.now() + cookieTime * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: true,
        SameSite: "none",
    };

    //set token in cookie
    res.status(200)
        .cookie("token", jwtToken, options)
        .json({ status: "success", data: { jwtToken, user } });
};

export { sendJwtToken };
