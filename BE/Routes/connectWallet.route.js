import express from "express";
import {connectWallet} from "../controllers/wallet.controller.js";

const router = express.Router();

router.post("/", connectWallet);

export default router;
