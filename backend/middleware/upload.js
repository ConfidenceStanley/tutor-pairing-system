const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)"), false);
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Signed upload using upload_stream - correct for server-side Node.js
const uploadToCloudinary = (fileBuffer, mimetype, folder) => {
  return new Promise((resolve, reject) => {
    // Build the upload stream with explicit auth
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
        ],
        // Force signed upload using your API credentials
        type: "upload",
        access_mode: "public",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", JSON.stringify(error, null, 2));
          reject(new Error(error.message || "Cloudinary upload failed"));
        } else {
          console.log("Cloudinary upload success:", result.secure_url);
          resolve(result);
        }
      }
    );

    // Write buffer directly to the upload stream
    uploadStream.end(fileBuffer);
  });
};

module.exports = { multerUpload, uploadToCloudinary };