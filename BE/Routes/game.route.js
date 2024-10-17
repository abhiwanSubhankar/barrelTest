import express from "express";
import {getAvgScore, saveBetAmount, saveGameScore} from "../controllers/game.controller.js";
import {Payments} from "../models/payment.model.js";

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
router.get("/avgScore", getAvgScore);
// router.get("/test", async (req, res) => {
//     let updatedPayments = await Payments.updateMany(
//         {createdAt: {$exists: false}}, // Only update documents missing createdAt
//         {
//             $set: {
//                 createdAt: "2024-10-08T13:03:54.786Z", // Inserts current date in ISO 8601 format
//                 updatedAt: "2024-10-08T13:03:54.786Z",
//             },
//         }
//     );

//     res.status(200).send(updatedPayments);
// });
// router.get("/leaderBoard", leaderBoard);

export default router;
