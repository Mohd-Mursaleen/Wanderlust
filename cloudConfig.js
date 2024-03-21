// Import required modules
if (process.env.NODE_ENV != "production") require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Create Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV", // Specify the folder in Cloudinary to store files
    allowedFormats: ["png", "jpg", "jpeg"], // Specify the allowed file formats
  },
});

// Export storage and cloudinary for use in other modules
module.exports = { storage, cloudinary };
