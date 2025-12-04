import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import { uploadProfile, uploadGallery } from "../middleware/upload.js";

const router = express.Router();

/* ========================
      USER CREATION + LIST
======================== */
router.post("/", userCtrl.create);
router.get("/", userCtrl.list);


/* ========================
      USER CRUD (READ/UPDATE/DELETE)
======================== */
router
  .route("/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);


/* ========================
      PROFILE PHOTO UPLOAD
======================== */
router.post(
  "/:userId/upload-photo",
  authCtrl.requireSignin,
  uploadProfile.single("profilePhoto"),
  userCtrl.uploadProfilePhoto
);

/* ========================
      GALLERY PHOTO UPLOAD
======================== */
router.post(
  "/:userId/upload-gallery",
  authCtrl.requireSignin,
  uploadGallery.single("galleryPhoto"),
  userCtrl.uploadGalleryPhoto
);


/* ========================
      PARAM BINDING
======================== */
router.param("userId", userCtrl.userByID);

export default router;
