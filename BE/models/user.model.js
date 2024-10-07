import mongoose, {model, Schema, Types} from "mongoose";

const matchSchema = new Schema(
    {
        userId: {type: Types.ObjectId, ref: "User", required: true},
        level: {type: Number, required: true},
        betAmount: {type: Number, required: true},
        score: {type: Number, required: true},
    },
    {timestamps: true, versionKey: false}
);

export const Match = mongoose.models.Match || model("Match", matchSchema);

const userSchema = new Schema(
    {
        ballance: {type: Number},
        walletAddress: {type: String},
    },
    {timestamps: true, versionKey: false}
);

export const User = mongoose.models.User || model("User", userSchema);
