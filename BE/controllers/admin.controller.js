import {tryCatch} from "../middlewares/error.js";
import {Admin} from "../models/admin.model.js";
import {Payments} from "../models/payment.model.js";
import {ErrorHandler} from "../utils/utility.js";
import jwt from "jsonwebtoken";

const adminLogin = tryCatch(async (req, res, next) => {
    let {email, password, walletDetails, cutPercentage, defaultRoomFee} = req?.body;

    let admin = await Admin.find({email});

    admin = admin[0];

    console.log({email, password, walletDetails, cutPercentage, defaultRoomFee}, admin[0]);

    if (!admin) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    if (admin.password !== password) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    let token = await jwt.sign({_id: admin._id}, "secretkeyKeith001");

    res.status(200).send({
        ststus: "success.",
        data: {
            token,
        },
    });
});

const getSendPayments = tryCatch(async (req, res, next) => {
    let allSendPayments = await Payments.find({type: "send"});

    return res.status(200).send({
        ststus: "success",
        data: allSendPayments,
    });
});

const getReceivedPayments = tryCatch(async (req, res, next) => {
    let allReceivedPayments = await Payments.find({type: "received"});

    return res.status(200).send({
        ststus: "success",
        data: allReceivedPayments,
    });
});

const updateHouseDetals = tryCatch(async (req, res, next) => {
    let adminDetails = await Admin.find({})[0];

    let {walletDetails, cutPercentage, defaultRoomFee} = req?.body;

    if (walletDetails) {
        adminDetails.walletDetails = walletDetails;
    }
    if (cutPercentage) {
        adminDetails.cutPercentage = cutPercentage;
    }
    if (defaultRoomFee) {
        adminDetails.defaultRoomFee = defaultRoomFee;
    }

    // update admin data

    let updatedData = await Admin.findByIdAndUpdate(adminDetails._id, adminDetails, {new: true});

    return res.status(200).send({
        ststus: "updated successFully",
        data: updatedData,
    });
});

const getHouseDetails = tryCatch(async (req, res, next) => {
    let adminDetails = await Admin.find({});

    res.status(200).send({
        status: "success.",
        data: adminDetails[0],
    });
});

export {adminLogin, getSendPayments, getReceivedPayments, getHouseDetails, updateHouseDetals};
