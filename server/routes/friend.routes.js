import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";

import {
  sendRequest,
  cancelRequest,
  acceptRequest,
  rejectRequest,
  unfriend,
  getFriends
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/:userId/send-request", authCtrl.requireSignin, sendRequest);
router.post("/:userId/cancel-request", authCtrl.requireSignin, cancelRequest);
router.post("/:userId/accept-request", authCtrl.requireSignin, acceptRequest);
router.post("/:userId/reject-request", authCtrl.requireSignin, rejectRequest);
router.post("/:userId/unfriend", authCtrl.requireSignin, unfriend);
router.get("/me/friends", authCtrl.requireSignin, getFriends);


// Bind :userId for automatic existence check (optional but better)
router.param("userId", userCtrl.userByID);

export default router;
