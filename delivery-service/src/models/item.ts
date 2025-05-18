import { Schema, model } from "mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    previewImageUrl: String,
    priceInAgorot: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Item = model("Item", schema);
