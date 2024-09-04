import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./Routes/foodRoute.js";
import userRouter from "./Routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./Routes/cartRoute.js";
import orderRouter from "./Routes/orderRoute.js";


//app config
const app = express()
const port = process.env.PORT || 8000;

//middleware
app.use(express.json()) //whenerver we get req from frontend to backend it will parse to json
app.use(cors());

//db
connectDB()

//api Endpoint 
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("Api working")
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
