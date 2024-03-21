const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedin ,isAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/review.js")
const {validateReview} =require("../middleware.js")

router.post("/" ,
 isLoggedin,
validateReview,
 wrapAsync(ReviewController.newReview))

router.delete("/:reviewId" ,
isLoggedin,
isAuthor, 
wrapAsync(ReviewController.deleteReview));
module.exports= router;