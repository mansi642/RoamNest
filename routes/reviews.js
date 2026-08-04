const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const {validateReview,isLoggedIn,isAuthor }=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


//for post review
router.post("",isLoggedIn,validateReview,wrapAsync(reviewController.addReview));

//for delete reviews
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;