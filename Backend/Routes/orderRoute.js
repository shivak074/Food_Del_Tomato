import express from "express"
import { listOrders, placeorder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js";
import { get } from "mongoose";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeorder)
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userorders",authMiddleware,userOrders)
orderRouter.get("/list",listOrders);
orderRouter.post("/status",updateStatus);


export default orderRouter;