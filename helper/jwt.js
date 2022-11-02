import jwt from "jsonwebtoken";

export function sign_token(data){
    return jwt.sign(data, process.env.APPJWTKEY)
}

export function verify_token(token){
    return jwt.verify(token, process.env.APPJWTKEY)
}