import mongoose, {model, Schema, Types} from "mongoose";

const userSchema = new Schema(
    {
        balance: {type: Number},
        walletAddress: {type: String},
    },
    {timestamps: true, versionKey: false}
);

export const User = mongoose.models.User || model("User", userSchema);
