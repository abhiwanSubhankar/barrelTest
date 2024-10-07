import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";

import userRoute from "./Routes/user.route.js";
import connectWalletRoute from "./Routes/connectWallet.route.js";

const app = express();

connectDB("mongodb://127.0.0.1/keithBe");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    return res.status(200).send({message: "Welcome to the barrel game server..."});
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/connectWallet", connectWalletRoute);

//admin
app.use("/api/v1/admin/login", connectWalletRoute);

// app.post("/", (req, res) => {
//     return res.status(200).send(req.body);
// });
console.log("re run");

app.listen(8080, async () => {
    try {
        console.log("server is running on port 8080");
    } catch (error) {
        console.log(error);
    }
});
