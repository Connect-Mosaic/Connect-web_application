import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folders exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDir("uploads/profile");
ensureDir("uploads/gallery");


// === PROFILE UPLOAD STORAGE ===
const profileStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/profile");
    },
    filename(req, file, cb) {
        cb(null, `user_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// === GALLERY UPLOAD STORAGE ===
const galleryStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/gallery");
    },
    filename(req, file, cb) {
        cb(null, `user_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only JPG/PNG images allowed"), false);
    }
    cb(null, true);
};

// Export TWO uploaders
export const uploadProfile = multer({ storage: profileStorage, fileFilter });
export const uploadGallery = multer({ storage: galleryStorage, fileFilter });
