import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect("db_url");
        console.log(`MongoDB connected: ${connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB