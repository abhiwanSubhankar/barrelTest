import {tryCatch} from "../middlewares/error.js";
import {User} from "../models/user.model.js";

const connectWallet = tryCatch(async (req, res, next) => {
    let walletAddress = req?.body.walletAddress || null;
    let deaultBalance = 5000;

    if (walletAddress) {
        let user = await User.findOne({walletAddress});
        if (user) {
            // connect wallet address and return details
            // connect wallet();

            return res.status(200).send({
                message: "wallet connected successFully!",
                data: user,
            });
        } else {
            let userData = {
                balance: deaultBalance,
                walletAddress,
            };

            let user = await User.create(userData);
            return res.status(201).send({
                message: "user created successFully",
                data: user,
            });
        }
    }
    return res.status(401).send({
        message: "please provide a valid wallet Address.",
    });
});

const createNewWallet = async (req, res, next) => {};

export {connectWallet, createNewWallet};
