import express from "express";
import {getAllUserDetails, getUserDetails} from "../controllers/user.controllers.js";

const router = express.Router();


router.get("/", getAllUserDetails);
router.get("/:id", getUserDetails);

// router.post("/login", (req, res, next) => {});
// router.put("/", (req, res, next) => {});
// router.patch("/", (req, res, next) => {});

export default router;
