const express = require("express");
const { isOwner, isLoggedin } = require("../middleware.js");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ListingController = require("../controllers/lisiting.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Listings = require("../models/listing.js");
const upload = multer({ storage: storage });

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedin,
    upload.single("listing[image.url]"),
    wrapAsync(ListingController.createListing)
  );

router.get("/new", isLoggedin, wrapAsync(ListingController.new));

router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(ListingController.edit));

router
  .route("/:id")
  .delete(isLoggedin, isOwner, wrapAsync(ListingController.delete))

  .put(isLoggedin, isOwner, wrapAsync(ListingController.updateListing))

  .get(wrapAsync(ListingController.show));

router.route("/search").post(ListingController.searchListing);
router.get("/search/:filter", wrapAsync(ListingController.filters));

module.exports = router;
