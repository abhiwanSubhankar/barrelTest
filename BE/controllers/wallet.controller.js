import {User} from "../models/user.model.js";

const connectWallet = async (req, res, next) => {
    let walletAddress = req?.body.walletAddress || null;

    if (walletAddress) {
        let user = await User.find({walletAddress});

        if (user) {
            // connect wallet address and return details
            // connect wallet();

            return res.status(200).send({
                message: "wallet connected successFully!",
                data: user,
            });
        } else {
            return res.status(401).send({
                message: "invalid wallet Address.",
            });
        }
    } else {
        let userData = {
            ballance: 0,
            walletAddress,
        };

        let user = await User.create(userData);

        return res.status(201).send({
            message: "user created successFully",
            data: user,
        });
    }
};

const createNewWallet = async (req, res, next) => {};

export {connectWallet, createNewWallet};
