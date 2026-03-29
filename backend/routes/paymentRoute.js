import express from "express";
import { 
    razorpayOrder, 
    verifyPayment 
} from "../controllers/orderController.js";

const paymentRouter = express.Router();

/**
 * Route to Create a Razorpay Order
 * This generates the order ID required to open the Razorpay checkout popup
 */
paymentRouter.post("/razorpay-order", razorpayOrder);

/**
 * Route to Verify Payment
 * This is called after a successful transaction to enroll the student in the course
 */
paymentRouter.post("/verify-payment", verifyPayment);

export default paymentRouter;