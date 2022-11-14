import mongoose from "mongoose";
const { Schema, model } = mongoose

const pre_processing_schema = new Schema({
    project: { type: Schema.Types.ObjectId, required: true },
    pre_processed_data: [new Schema({
        name: { type: String, required: true },
        stats: {
            maximum: { type: Number, default: null },
            minimum: { type: Number, default: null },
            mean: { type: Number, default: null },
            standard_deviation: { type: Number, defualt: null },
            labels: [{
                name: { type: String, required: true },
                count: { type: Number, required: true }
            }],
        },
        info: {
            type: { type: String, enum: ["String", "Numerical"], required: true },
            missing: { type: Number, required: true },
            unique: { type: Number, required: true },
        }
    }, { _id: false })]
})

export const Pre_processing = model("Pre_processing", pre_processing_schema) 