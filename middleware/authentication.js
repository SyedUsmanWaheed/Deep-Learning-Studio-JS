import { verify_token } from "../helper/jwt.js"


export let isUserAuthorized = (req, res, next) => {
    let authorization_token = req.headers.authorization

    let token = authorization_token.split(" ")[1]

    try{
        req.user = verify_token(token)
        next()
    }catch(err){
        return res.json({error: true, info: "inValid Token"})
    }
}