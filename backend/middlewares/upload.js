import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// === FILE SIZE LIMIT (5MB Example) ===
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "campaigns";

    if (file.fieldname === "orgProof") folder = "organization_proofs";
    if (file.fieldname === "campaignDocs") folder = "campaign_documents";
    if (file.fieldname === "campaignImage") folder = "campaign_images";

    return {
      folder,
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

// FILTER FUNCTION FOR SIZE + TYPE
const fileFilter = (req, file, cb) => {
  // type check
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
