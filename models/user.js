import mongoose from "mongoose";
const { model, Schema } = mongoose
const { ObjectId } = Schema

const user_schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    token: { type: String, default: null }

})

export const User = model("user", user_schema)