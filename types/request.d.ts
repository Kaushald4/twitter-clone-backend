import { IUser } from "./../models/User";
import { Request } from "express";
// export interface RequestX extends Request {
//     [key: string]: any;
// }

export declare module "express" {
    export interface RequestX extends Request {
        auth?: IUser;
        files: any;
        file: any;
        user?: IUser;
    }
}
