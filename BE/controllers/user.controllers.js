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
    try {
        let {userId} = req?.body;

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
    } catch (error) {
        return res.status(401).send({
            message: "Invalid userID",
            error
        });
    }
};

export {getAllUserDetails, getUserDetails};
