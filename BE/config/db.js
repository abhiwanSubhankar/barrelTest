import mongoose from "mongoose";

const connectDB = async (uri) => {
    console.log("Trying to connect...");

    try {
        const data = await mongoose.connect(uri);
        console.log(`Connected to DB: ${data.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to DB: ${err.message}`);
        process.exit(1); // Optional: exit process if connection fails
    }
};

export {connectDB};
