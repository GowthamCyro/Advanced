import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = mongoose.createConnection(`${process.env.MONGODB_URI}/${DB_NAME}`,{
            useUnifiedTopology : true,
            useNewUrlParser : true
        });
        console.log(`\n MongoDB Connected !! DB Host : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGEDB Connection Error",error)
        process.exit(1)
    }

    return connectionInstance
}


export { connectDB }