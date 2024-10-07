import express from "express";
import {connectWallet} from "../controllers/wallet.controller.js";

const router = express.Router();

// router.post("/", (req, res) => {
//     return res.status(200).send("ok cgnmg");
// });
router.post("/", connectWallet);


export default router;
