import crypto from "crypto";

interface Props {
    digits: number;
    exp: number;
}

export const generateVerificationCode = ({ digits = 6, exp = 20 }: Props) => {
    //generating 6 digits code by default
    const code = Math.floor(10 ** (digits - 1) + Math.random() * (90 * 10 ** (digits - 2)));

    // creating hashed version of above generated code
    const hashedCode = crypto.createHash("sha256").update(String(code)).digest("hex");

    // setting the code expiry to 20 min by default
    const codeExpiry = Date.now() + exp * 60 * 1000; // (20min)

    return [code, hashedCode, codeExpiry];
};
