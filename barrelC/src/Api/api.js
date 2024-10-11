// import "regenerator-runtime/runtime";

import axios from "axios";

// const fetch = require("node-fetch");

// const baseURL=
const URL = "https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/x0F54MZKHqJe2ginwdHQ/scores/";


//  helpers
let url = ``;
function successResponse(data) {
    return {
        response: true,
        error: false,
        data,
    };
}
function errorResponse(message, code) {
    return {
        response: false,
        error: true,
        err: {
            message,
            code,
        },
    };
}

// main functions
const getBalance = async () => {
    await axios
    .get(url)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};

const placeBet = async (username, score) => {
    await axios
    .get(url)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};

const updatePlayerBalance = async (username, score) => {
    await axios
    .get(url)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};

const saveScore = async (username, score) => {
    await axios
    .get(url)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};


export {placeBet,getBalance,updatePlayerBalance,saveScore};



// const response = await fetch(URL, {
//     method: "POST",
//     mode: "cors",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//         user: username,
//         score: score.toString(),
//     }),
// });
// const result = response.json();
// return result;
