import mongoose from "mongoose"
const { model, Schema } = mongoose
const { ObjectId } = Schema

const tags_schema = new Schema({
    name: { type: String, required: true }
})

export const Tags = model("tags", tags_schema)