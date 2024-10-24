import axios from "axios";

//  helpers
// let baseURL = `http://localhost:8080/api/v1`;
let baseURL = `https://barreltest.onrender.com/api/v1`;

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
const getBalance = async (userId) => {
    await axios
    .get(`${baseURL}/users/${userId}`)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};
const getAvgScore = async () => {
   return await axios
    .get(`${baseURL}/game/avgScore`)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};

const connectCreateWallet = async (walletAddress) => {
    return await axios
    .post(`${baseURL}/connectWallet`, walletAddress)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};

const placeBet = async (userId, betAmount) => {
    console.log("tydtdtdt",{userId, betAmount});
    
    return await axios
    .post(`${baseURL}/game/saveBetAmount`, {userId, betAmount})
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

const saveScore = async (data) => {
    return await axios
    .post(`${baseURL}/game/saveScore`, data)
    .then((res) => {
        console.log(res.data);
        return successResponse(res.data);
    })
    .catch((er) => {
        console.log(er);

        return errorResponse(er.message, er.code);
    });
};

export {placeBet, getBalance, updatePlayerBalance, saveScore, connectCreateWallet,getAvgScore};

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
