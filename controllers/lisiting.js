const ExpressError = require("../utils/ExpressError.js");
const Listings = require("../models/listing.js");

// Get all listings and render the index page
module.exports.index = async (req, res) => {
  let allListings = await Listings.find({});
  res.render("listings/index.ejs", { allListings });
};

// Render the form for creating a new listing
module.exports.new = async (req, res) => {
  res.render("listings/new.ejs");
};

// Create a new listing
module.exports.createListing = async (req, res) => {
  // Extract necessary information from the request
  let { path: url, filename } = req.file;
  const { listing } = req.body;

  // Create a new listing object and save it to the database
  const newListing = new Listings(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.filters = req.body.filters;
  await newListing.save();

  // Flash success message and redirect to the listings page
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// Render the form for editing a listing
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  res.render("listings/edit.ejs", { listing });
};

// Delete a listing
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listings.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

// Update a listing
module.exports.updateListing = async (req, res) => {
  // Check if the request contains the necessary data
  if (!req.body.listing) {
    throw new ExpressError(400, "Bad Request");
  }

  // Update the listing in the database
  let { id } = req.params;
  await Listings.findByIdAndUpdate(id, { ...req.body.listing });

  // Flash success message and redirect to the listings page
  req.flash("success", "Listing updated!");
  res.redirect("/listings");
};

// Show details of a specific listing
module.exports.show = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  // If the listing doesn't exist, redirect to the listings page with an error message
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Render the show page with the listing details
  res.render("listings/show.ejs", { listing });
};

// Search for listings based on the provided name
module.exports.searchListing = async (req, res) => {
  try {
    const { name } = req.body;

    // Find listings matching the provided name
    const allListings = await Listings.find({
      title: { $regex: name, $options: "i" },
    });

    // If no matching listings are found, redirect to the listings page with an error message
    if (allListings.length === 0) {
      req.flash("error", "Searched result not found");
      return res.redirect("/listings");
    }

    // Render the index page with the search results
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    // Handle errors and redirect to the listings page with an error message
    console.error("Error searching listings:", err);
    req.flash("error", "An error occurred while searching listings");
    res.redirect("/listings");
  }
};
module.exports.filters = async (req, res) => {
  let { filter } = req.params;
  // console.log(filter);
  const allListings = await Listings.find({
    filters: { $regex: new RegExp(filter, "i") },
  });
  if (allListings.length === 0) {
    return res.redirect("/listings");
  }

  // Render the index page with the search results
  res.render("listings/index.ejs", { allListings });
};

// console.log(filteredListings);
