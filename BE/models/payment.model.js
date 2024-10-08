import mongoose, {model, Schema, Types} from "mongoose";

const paymentSchema = new Schema({
    userId: {type: Types.ObjectId, ref: "User", required: true},
    amount: {type: Number, required: true},
    type: {
        type: String,
        enum: ["send", "received"],
        required: true,
        trim: true,
    },
    reason: {type: String, required: true},
});

export const Payments = mongoose.models.Payments || model("Payments", paymentSchema);
