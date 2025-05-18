import { Schema, model } from "mongoose";

const schema = new Schema({
    phase: {
        type: String,
        enum: [
            "received",
            "opened",
            "making",
            "ready",
            "picked-up",
            "arrived",
        ],
        required: true,
    },
    restaurant: {
        type: String,
        require: true,
    },
    items: {
        require: true,
        type: [{
            itemId: {
                type: Schema.Types.ObjectId,
                ref: 'Story',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }]
    },
}, { timestamps: true });

export const Order = model("Order", schema);
