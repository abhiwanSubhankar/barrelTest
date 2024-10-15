import express from "express";
import {getAllUserDetails, getUserDetails} from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/", getAllUserDetails);
router.get("/:id", getUserDetails);
// router.put("/", (req, res, next) => {});

export default router;
