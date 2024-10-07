// import {User} from "../models/user.model.js";

import {User} from "../models/user.model.js";

const getAllUserDetails = async (req, res, next) => {
    try {
        let allUser = await User.find({});

        return res.status(200).send({data: allUser});
    } catch (error) {
        return res.status(500).send(error);
    }
};

const getUserDetails = async (req, res, next) => {
    let userId = req?.params.id;

    if (!userId) {
        return res.status(401).send({
            message: "Invalid userID",
        });
    } else {
        let userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(401).send({
                message: "Invalid userID",
            });
        }

        return res.status(200).send({
            message: "successful.",
            data: userDetails,
        });
    }
};

const userLogin = async (req, res, next) => {
    let loginData = req?.body;
};

export {getAllUserDetails, getUserDetails};
