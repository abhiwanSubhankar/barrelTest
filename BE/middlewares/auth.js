import {Admin} from "../models/admin.model.js";
import {ErrorHandler} from "../utils/utility.js";
import {tryCatch} from "./error.js";
import jwt from "jsonwebtoken";

const isAdmin = tryCatch(async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // if (!token) return next(new ErrorHandler("You are not authorized, only Admin can access this... ", 401));

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const adminId = await jwt.verify(token, "secretkeyKeith001");

        let admin = await Admin.findById(adminId._id);

        if (!adminId) {
            return next(new ErrorHandler("You are not authorized, only Admin can access this... ", 401));
        }

        req.adminId = adminId._id;

        // return res.send(adminId._id);
        next();
    } else {
        return next(new ErrorHandler("You are not authorized, only Admin can access this... ", 401));
    }
});

export {isAdmin};
