import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect(process.env.MONOGODB_URL)
    .then(()=>console.log("DB connected"))
}