import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// === MAX FILE SIZE: 5MB ===
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// Allowed file types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

// ===============================
// 🔥 CLEAN FILENAME SANITIZER
// ===============================
function sanitizeFilename(originalname) {
  // Remove extension (only last extension)
  let name = originalname.replace(/\.[^/.]+$/, "");


  // Replace spaces with underscore
  name = name.replace(/\s+/g, "_");


  // Remove all symbols except A-Z, a-z, 0-9, _, -
  name = name.replace(/[^a-zA-Z0-9_-]/g, "");

  return name;
}

// ===============================
// 🔥 CLOUDINARY STORAGE ENGINE
// ===============================
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Default folder
    let folder = "campaigns";

    // Dynamic folder selection
    if (file.fieldname === "orgProof") folder = "organization_proofs";
    if (file.fieldname === "campaignDocs") folder = "campaign_documents";
    if (file.fieldname === "campaignImage") folder = "campaign_images";

    // Sanitize clean filename
    const cleanedName = sanitizeFilename(file.originalname);

    // Unique value to avoid collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    return {
      folder,
      public_id:
      file.mimetype === "application/pdf"
        ? `${uniqueSuffix}-${cleanedName}.pdf`
        : `${uniqueSuffix}-${cleanedName}`,


      resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],

    };
  },
});

// ===============================
// 🔥 FILE FILTER
// ===============================
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Unsupported file format"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter,
});

export default upload;

