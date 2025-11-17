import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import { uploadProfile, uploadGallery } from "../middleware/upload.js";


const router = express.Router();

// CREATE + LIST
router.route("/")
  .post(userCtrl.create)
  .get(userCtrl.list);

// READ / UPDATE / DELETE USER
router.route("/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.post(
  "/:userId/upload-photo",
  authCtrl.requireSignin,
  uploadProfile.single("profilePhoto"),
  userCtrl.uploadProfilePhoto
);

router.post(
  "/:userId/upload-gallery",
  authCtrl.requireSignin,
  uploadGallery.single("galleryPhoto"),
  userCtrl.uploadGalleryPhoto
);


// Bind :userId to userCtrl.userByID
router.param("userId", userCtrl.userByID);

export default router;
