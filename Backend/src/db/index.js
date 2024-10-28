import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const dbURI = `${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`;
        const connection = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected! DB Host: ${connection.connection.host}`);
        return connection.connection.getClient(); // Return MongoDB client directly
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); // Exit process if connection fails
    }
};

export default connectDB;
