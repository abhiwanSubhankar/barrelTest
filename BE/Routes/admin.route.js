import express from "express";
import {getAllUserDetails, getUserDetails} from "../controllers/user.controllers.js";
import {
    adminLogin,
    getHouseDetails,
    getCreditedPayments,
    getDebitedPayments,
    updateHouseDetals,
    getAllMatches,
} from "../controllers/admin.controller.js";
import {isAdmin} from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (req, res, next) => {
    return res.status(200).send({message: "welcome to admin route."});
});
router.post("/login", adminLogin);
router.use(isAdmin);
router.get("/allUser", getAllUserDetails);
router.get("/userDetails", getUserDetails);
router.get("/payments/debit", getDebitedPayments);
router.get("/payments/credit", getCreditedPayments);
router.post("/houseCut", updateHouseDetals);
router.get("/houseCut", getHouseDetails);
router.get("/allMatches", getAllMatches);

export default router;
