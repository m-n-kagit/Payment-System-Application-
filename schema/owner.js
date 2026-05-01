import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "System Owner"
    },
    earnings: {
        type: Number,
        default: 0
    }
});

export const Owner = mongoose.model("Owner", ownerSchema);
