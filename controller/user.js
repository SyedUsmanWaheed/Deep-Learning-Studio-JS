import mongoose from "mongoose";
import joi from "joi";
import { add, getOne, updateData } from "../services/CRUD.js";
import { User } from "../models/user.js";
import { sign_token } from "../helper/jwt.js";

export let register_user = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        email: joi.string().required(),
        password: joi.string().required(),
        name: joi.string().required()
    })

    let { error, value } = validation_schema.validate(req.body)
    if (error) {
        console.log(err)
        return res.json({ error: true, info: error.message })
    }
    try {

        let { email, password, name } = req.body
        let register = await add(User, { email, password, name })
        return res.json({ error: false, info: "User Registered" })

    } catch (err) {
        console.log(err)
        return res.json({ error: true, info: error.message })
    }
}

export let login_user = async (req, res, next) => {
    let validation_schema = joi.object().keys({
        email: joi.string().required(),
        password: joi.string().required()
    })

    let { error, value } = validation_schema.validate(req.body)
    if (error) {
        console.log(err)
        return res.json({ error: true, info: error.message })
    }

    try {

        let user = await getOne(User, { email: req.body.email })
        if (!user) {
            return res.json({ error: true, info: "user not found" })
        }
        if (user.password !== req.body.password) {
            return res.json({ error: true, info: "invalid password" })
        }
        let jwt_token = sign_token({
            user_id: user._id
        })

        let updated = await updateData(User, { _id: user._id }, { token: jwt_token })
        return res.json({ error: false, info: "Successfully Logged in" , token: jwt_token})

    } catch (err) {
        console.log(err)

    }
}