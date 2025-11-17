import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const dir = "uploads/profile";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, dir);
  },
  filename(req, file, cb) {
    const unique = `user_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG/PNG images allowed"), false);
  }
  cb(null, true);
};

export default multer({ storage, fileFilter });
