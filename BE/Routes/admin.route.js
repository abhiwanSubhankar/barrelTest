import express from "express";
import {getAllUserDetails, getUserDetails} from "../controllers/user.controllers.js";
import {
    adminLogin,
    getHouseDetails,
    getReceivedPayments,
    getSendPayments,
    updateHouseDetals,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (req, res, next) => {
    return res.status(200).send({message: "welcome to admin route."});
});

router.post("/login", adminLogin);
router.use(isAdmin);
router.get("/allUser", getAllUserDetails);
router.get("/user/:id", getUserDetails);
router.get("/payments/send", getSendPayments);
router.get("/payments/received", getReceivedPayments);
router.post("/houseCut", updateHouseDetals);
router.get("/houseCut", getHouseDetails);

export default router;
