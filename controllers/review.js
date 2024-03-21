const Reviews = require("../models/review.js");
const Listings = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

// Controller to create a new review for a listing
module.exports.newReview = async (req, res) => {
  let { id } = req.params;

  // Create a new review object based on the request body
  let newReview = new Reviews(req.body.review);

  // Find the listing by its ID
  let listing = await Listings.findById(id);

  // Set the author of the review to the current user
  newReview.author = req.user;

  // Add the new review to the listing's reviews array
  listing.reviews.push(newReview);

  // Save the listing and the new review to the database
  await listing.save();
  await newReview.save();

  // Flash success message and redirect to the listing's page
  req.flash("success", "Review Submitted!");
  res.redirect(`/listings/${id}`);
};

// Controller to delete a review
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  // Remove the review ID from the listing's reviews array
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review from the database
  await Reviews.findByIdAndDelete(reviewId);

  // Flash success message and redirect to the listing's page
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
