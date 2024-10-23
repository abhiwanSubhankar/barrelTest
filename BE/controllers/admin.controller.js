import {tryCatch} from "../middlewares/error.js";
import {Admin} from "../models/admin.model.js";
import {Match} from "../models/match.model.js";
import {Payments} from "../models/payment.model.js";
import {ErrorHandler} from "../utils/utility.js";
import jwt from "jsonwebtoken";

const adminLogin = tryCatch(async (req, res, next) => {
    let {email, password, walletDetails, cutPercentage, defaultRoomFee} = req?.body;

    let admin = await Admin.findOne({email});

    if (!admin) {
        return next(new ErrorHandler("Invalid email or password 1.", 400));
    }

    if (admin.password !== password) {
        return next(new ErrorHandler("Invalid email or password. 2", 400));
    }

    if (admin._doc.email !== email) {
        return next(new ErrorHandler("Invalid email or password. 3", 400));
    }

    let token = jwt.sign({_id: admin._id}, "secretkeyKeith001");

    res.status(200).json({
        ststus: "success.",
        data: {
            token,
            email: admin._doc.email,
        },
    });
});

const getDebitedPayments = tryCatch(async (req, res, next) => {
    let allDebitedPayments = await Payments.find({type: "debit"});

    return res.status(200).send({
        ststus: "success",
        data: allDebitedPayments,
    });
});

const getCreditedPayments = tryCatch(async (req, res, next) => {
    let allCreditedPayments = await Payments.find({type: "credit"});

    return res.status(200).send({
        ststus: "success",
        data: allCreditedPayments,
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
const getAllMatches = tryCatch(async (req, res, next) => {
    let allMatches = await Match.find({});

    res.status(200).send({
        status: "success.",
        data: allMatches,
    });
});

const getStatistics = tryCatch(async (req, res, next) => {
    let {range} = req?.body;

    const calculateStatisticsPromise = [
        Match.aggregate([
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {$limit: +range},
            {
                $group: {
                    _id: null,
                    avgScore: {
                        $avg: "$score",
                    },
                },
            },
        ]),
        Payments.aggregate([
            {
                $match: {
                    type: "debit",
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {$limit: +range},
            {
                $group: {
                    _id: null,
                    totalPayOut: {
                        $sum: "$amount",
                    },
                },
            },
        ]),
        Payments.aggregate([
            {
                $match: {
                    type: "credit",
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {$limit: +range},
            {
                $group: {
                    _id: null,
                    totalReceived: {
                        $sum: "$amount",
                    },
                },
            },
        ]),
    ];

    let [avgScoreData, totalPayOutData, totalReceivedData] = await Promise.all(calculateStatisticsPromise);

    return res.status(200).send({
        status: "Statistics get successful.",
        data: {
            avgScore: avgScoreData[0].avgScore.toFixed(2),
            totalPayOut: totalPayOutData[0].totalPayOut,
            totalReceived: totalReceivedData[0].totalReceived,
        },
    });
});

export {
    adminLogin,
    getDebitedPayments,
    getCreditedPayments,
    getHouseDetails,
    updateHouseDetals,
    getAllMatches,
    getStatistics,
};
