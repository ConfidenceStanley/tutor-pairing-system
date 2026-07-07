const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const config = cloudinary.config();
if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.error("WARNING: Cloudinary env variables are missing!");
} else {
  console.log("Cloudinary configured for cloud:", config.cloud_name);
}

module.exports = cloudinary;