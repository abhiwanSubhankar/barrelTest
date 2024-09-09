const express = require("express");
const cors =require("cors")

const app = express();

app.use(express.json());
app.use(cors())
// app.get("/", (req, res) => {
//     return res.status(200).send({message: "Welcome to the barrel game server..."});
// });ssss

app.post("/", (req, res) => {
    return res.status(200).send(req.body);
});

app.listen(8080, async () => {
    try {
        console.log("server is running on port 8080");
    } catch (error) {
        console.log(error);
    }
});
