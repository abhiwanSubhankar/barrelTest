import {tryCatch} from "../middlewares/error.js";
import {Admin} from "../models/admin.model.js";
import {Match} from "../models/match.model.js";
import {Payments} from "../models/payment.model.js";
import {User} from "../models/user.model.js";
import {ErrorHandler} from "../utils/utility.js";

const saveGameScore = tryCatch(async (req, res, next) => {
    let data = req?.body;
    let {userId, level, betAmount, score, cashPotHits} = data;

    //  add wining amount to the user
    let user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("Invalid user.", 401));
    }

    let finalScore = +(betAmount * score).toFixed(2);
    console.log("save ballance called", finalScore);
    user.balance += finalScore;
    let userData = await User.findByIdAndUpdate(user._id, user, {new: true});

    console.log(userData);

    //  todo - debit money to house wallet.
    let admin = await Admin.find({})[0];

    // debit money to admin wallet.

    let match = await Match.create(data);

    console.log("final score.;", finalScore);

    let paymentData = {
        userId,
        amount: finalScore,
        type: "debit", // debit from admin
        reason: "winning amount.",
    };

    let payment = await Payments.create(paymentData);

    return res.status(201).send({
        status: "success.",
        data: match,
    });
});

const saveBetAmount = tryCatch(async (req, res, next) => {
    let data = req?.body;
    let {userId, betAmount} = data;

    if (+betAmount <= 0) {
        return next(new ErrorHandler("Please Enter a valid Bet Amount.", 401));
    }

    let user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("Invalid user.", 401));
    }

    let paymentData = {
        userId,
        amount: betAmount,
        type: "credit", // credited to the admin
        reason: "bet amount placed in game.",
    };

    let payment = await Payments.create(paymentData);
    user.balance -= betAmount;

    console.log("placed Bet called");

    let userData = await User.findByIdAndUpdate(user._id, user, {new: true});
    console.log(userData);

    //  todo - add money to house wallet.
    let admin = await Admin.find({})[0];

    // add money to admin wallet.

    return res.status(201).send({
        status: "success.",
        data: payment,
    });
});

const getAvgScore = tryCatch(async (req, res, next) => {
    const result = await Match.aggregate([
        
        {
            $group: {
                _id: null,
                averageScore: {$avg: "$score"},
                betSizes: {$sum: "$betAmount"},
                betSizesT: {$sum: {$multiply: ["$betAmount", "$score"]}},
            },
        },
    ]);

    let weightedAverageScore = (result[0].betSizesT / result[0].betSizes).toFixed(2);

    // Access the average score
    if (result.length > 0) {
        console.log(`Average score is: ${result[0].averageScore.toFixed(2)}`);

        return res.status(200).send({
            status: "success.",
            data: {
                averageScore: result[0].averageScore.toFixed(2),
                betSizes: result[0].betSizes.toFixed(2),
                weightedAverageScore,
            },
        });
    } else {
        console.log("No records found.");
        return next(new ErrorHandler("No records Found.", 400));
    }
});

export {getAvgScore, saveGameScore, saveBetAmount};
