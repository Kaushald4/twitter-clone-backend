"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateVerificationCode = ({ digits = 6, exp = 20 }) => {
    //generating 6 digits code by default
    const code = Math.floor(10 ** (digits - 1) + Math.random() * (90 * 10 ** (digits - 2)));
    // creating hashed version of above generated code
    const hashedCode = crypto_1.default.createHash("sha256").update(String(code)).digest("hex");
    // setting the code expiry to 20 min by default
    const codeExpiry = Date.now() + exp * 60 * 1000; // (20min)
    return [code, hashedCode, codeExpiry];
};
exports.generateVerificationCode = generateVerificationCode;
