import express from "express";
import { 
    createReview, 
    getReviews 
} from "../controllers/reviewController.js";
import isAuth from "../middleware/isAuth.js";

const reviewRouter = express.Router();

/**
 * Route to Create a Review
 * Protected: Requires a valid user token to identify the reviewer
 */
reviewRouter.post("/create-review", isAuth, createReview);

/**
 * Route to Get All Reviews
 * Public: Used to display feedback on the Home Page and Course views
 */
reviewRouter.get("/get-review", getReviews);

export default reviewRouter;