import mongoose, {model, Schema} from "mongoose";

const adminSchema = new Schema(
    {
        walletDetails: {walletId: {type: String, required: true}},
        cutPercentage: {type: Number, required: true},
        defaultRoomFee: {type: Number},
        eamil: {type: String},
        password: {type: String},
    },
    {timestamps: true, versionKey: false}
);

export const Admin = mongoose.models.Admin || model("Admin", adminSchema);
