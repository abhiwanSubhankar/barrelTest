import express from "express";
import {getAvgScore, saveBetAmount, saveGameScore} from "../controllers/game.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.status(200).send({
        status: "success.",
        message: "welcome to game route.",
    });
});
// save score and bet amount payment stats
router.post("/saveScore", saveGameScore);
router.post("/saveBetAmount", saveBetAmount);

// router.get("/leaderBoard", leaderBoard);
router.get("/avgScore", getAvgScore);

export default router;
