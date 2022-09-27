import { RequestX, Response, NextFunction } from "express";
import jwt, { IJwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { catchAsyncError } from "../utils/catchAsyncError";

export const isAuthenticated = catchAsyncError(
    async (req: RequestX, res: Response, next: NextFunction) => {
        let token = req.cookies.token || req.headers.authorization?.replace("Bearer", "").trim();

        if (!token) {
            return next(new AppError("Invalid token! Login again", 401));
        }

        const decoded = <IJwtPayload>jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError("User no longer exists!", 401));
        }

        const isUserChangedPassword = user.passwordChangedAfter(decoded.iat as number);

        if (isUserChangedPassword) {
            res.clearCookie("token", { expires: new Date(), httpOnly: true });
            return next(new AppError("Password recently changed login again!", 401));
        }

        req.auth = user;
        return next();
    }
);

//socket io auth

export const checkSocketAuth = async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    next: (err?: ExtendedError | undefined) => void
) => {
    let token = socket.handshake.auth.token;

    if (!token) {
        return next(new AppError("Invalid token! Login again", 401));
    }

    const decoded = <IJwtPayload>jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError("User no longer exists!", 401));
    }

    const isUserChangedPassword = user.passwordChangedAfter(decoded.iat as number);

    if (isUserChangedPassword) {
        return next(new AppError("Password recently changed login again!", 401));
    }
    socket.data.user = user;
    return next();
};
