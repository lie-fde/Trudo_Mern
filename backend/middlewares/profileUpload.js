import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

function sanitizeFilename(originalname) {
  // Remove extension
  let name = originalname.replace(/\.[^/.]+$/, "");

  // Replace spaces with underscore
  name = name.replace(/\s+/g, "_");

  // Keep only valid characters
  name = name.replace(/[^a-zA-Z0-9_-]/g, "");

  return name;
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const cleanedName = sanitizeFilename(file.originalname);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    return {
      folder: "profile_images",
      public_id: `${uniqueSuffix}-${cleanedName}`,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG images allowed"), false);
  }
  cb(null, true);
};

const profileUpload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter,
});

export default profileUpload;
