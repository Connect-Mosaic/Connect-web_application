import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.post("/", userCtrl.create);
router.get("/", userCtrl.list);

router
  .route("/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

// ⭐ Upload profile photo
router.post(
  "/api/users/:userId/upload-photo",
  authCtrl.requireSignin,                     // Require login
  upload.single("profilePhoto"),              // Use multer
  userCtrl.uploadProfilePhoto                 // Call correct controller
);

// Upload Album
router.post(
  "/api/users/:userId/upload-gallery",
  authCtrl.requireSignin,
  upload.single("galleryPhoto"),
  userCtrl.uploadGalleryPhoto
);


// Bind userId param
router.param("userId", userCtrl.userByID);

export default router;
