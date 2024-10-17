import mongoose, {model, Schema, Types} from "mongoose";

const paymentSchema = new Schema(
    {
        userId: {type: Types.ObjectId, ref: "User", required: true},
        amount: {type: Number, required: true},
        type: {
            type: String,
            enum: ["debit", "credit"],
            required: true,
            trim: true,
        },
        reason: {type: String, required: true},
    },
    {timestamps: true, versionKey: false}
);

export const Payments = mongoose.models.Payments || model("Payments", paymentSchema);
