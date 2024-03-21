const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js");

const filterEnum = [
  "mountain",
  "snow",
  "beach",
  "countryside",
  "farms",
  "swimming-pools",
  "iconic-cities",
  "camping",
]; // Define the enum values

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png",
      set: (v) =>
        v === ""
          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"
          : v,
    },
    filename: {
      type: String,
      default: "listing image",
    },
  },
  filters: {
    type: [
      {
        type: String,
        enum: filterEnum, // Specify the enum values here
      },
    ],
    default: [], // Set a default empty array
  },
  reviews: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Reviews",
    },
  ],
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
  price: Number,
  location: String,
  country: String,
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listings = mongoose.model("Listings", listingSchema);
module.exports = Listings;
