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
    let resourceType = "auto";

    if (file.fieldname === "orgProof") folder = "organization_proofs";
    if (file.fieldname === "campaignDocs")folder = "campaign_documents";
    if (file.fieldname === "campaignImage") folder = "campaign_images";

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = file.originalname.split('.')[0];


    return {
      folder,
      resource_type: resourceType,
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],public_id: `${uniqueSuffix}-${filename}`,
      // Explicitly tell Cloudinary to treat it as a PDF if the mime matches
      format: file.mimetype === "application/pdf" ? "pdf" : undefined,
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
