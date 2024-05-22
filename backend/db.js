import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect("mongodb+srv://prathyarti:mongo@cluster0.7ifjzfq.mongodb.net/waterfootprint");
        console.log(`MongoDB connected: ${connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB