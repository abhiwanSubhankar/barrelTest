import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import userRoute from "./Routes/user.route.js";
import connectWalletRoute from "./Routes/connectWallet.route.js";
import adminRoute from "./Routes/admin.route.js";
import gameRoute from "./Routes/game.route.js";
import {errorMiddleware} from "./middlewares/error.js";



const app = express();

connectDB("mongodb://127.0.0.1/keithBe");
app.use(express.json());
app.use(cors());

// game routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/connectWallet", connectWalletRoute);
app.use("/api/v1/game", gameRoute);
app.use("/api/v1/admin", adminRoute);
app.get("/", (req, res) => {return res.status(200).send({message: "Welcome to the barrel game server..."});
});

app.use(errorMiddleware);
app.listen(8080, async () => {
    try {
        console.log("server is running on port 8080");
    } catch (error) {
        console.log(error);
    }
});
