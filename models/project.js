import mongoose from "mongoose"
import { User } from "./user.js"
const { model, Schema } = mongoose
const { ObjectId } = Schema


const project_schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['ML', 'DL'], required: true },
    owner: { type: ObjectId, required: true, ref: User },
    dataset_key: { type: String, default: null },
    description: { type: String, required: true },
    tags: [ String ],


})

export const Project = model("project", project_schema)