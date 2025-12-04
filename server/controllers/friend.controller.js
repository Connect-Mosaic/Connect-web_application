import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../helpers/apiResponse.js";

function idsEqual(a, b) {
  return a.toString() === b.toString();
}

/* ============================================================
    SEND FRIEND REQUEST
============================================================ */
export const sendRequest = async (req, res) => {
  try {
    const senderId = req.auth.userId;
    const receiverId = req.params.userId;

    if (idsEqual(senderId, receiverId))
      return res.json(errorResponse("You cannot add yourself."));

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver)
      return res.json(errorResponse("User not found."));

    if (sender.friends.includes(receiverId))
      return res.json(errorResponse("Already friends."));

    if (sender.sentRequests.includes(receiverId))
      return res.json(errorResponse("Request already sent."));

    if (sender.receivedRequests.includes(receiverId))
      return res.json(errorResponse("This user has already sent you a request."));

    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    return res.json(successResponse("Friend request sent."));
  } catch (err) {
    console.error("sendRequest error:", err);
    return res.json(errorResponse("Failed to send request."));
  }
};

/* ============================================================
    CANCEL (WITHDRAW) FRIEND REQUEST
============================================================ */
export const cancelRequest = async (req, res) => {
  try {
    const senderId = req.auth.userId;
    const receiverId = req.params.userId;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    sender.sentRequests = sender.sentRequests.filter(id => !idsEqual(id, receiverId));
    receiver.receivedRequests = receiver.receivedRequests.filter(id => !idsEqual(id, senderId));

    await sender.save();
    await receiver.save();

    return res.json(successResponse("Friend request canceled."));
  } catch (err) {
    console.error("cancelRequest error:", err);
    return res.json(errorResponse("Failed to cancel request."));
  }
};

/* ============================================================
    ACCEPT FRIEND REQUEST
============================================================ */
export const acceptRequest = async (req, res) => {
  try {
    const receiverId = req.auth.userId;
    const senderId = req.params.userId;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver.receivedRequests.includes(senderId))
      return res.json(errorResponse("No friend request from this user."));

    // remove request
    receiver.receivedRequests = receiver.receivedRequests.filter(id => !idsEqual(id, senderId));
    sender.sentRequests = sender.sentRequests.filter(id => !idsEqual(id, receiverId));

    // add friends
    if (!receiver.friends.includes(senderId)) receiver.friends.push(senderId);
    if (!sender.friends.includes(receiverId)) sender.friends.push(receiverId);

    await receiver.save();
    await sender.save();

    return res.json(successResponse("Friend request accepted."));
  } catch (err) {
    console.error("acceptRequest error:", err);
    return res.json(errorResponse("Failed to accept request."));
  }
};

/* ============================================================
    REJECT FRIEND REQUEST
============================================================ */
export const rejectRequest = async (req, res) => {
  try {
    const receiverId = req.auth.userId;
    const senderId = req.params.userId;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    receiver.receivedRequests = receiver.receivedRequests.filter(id => !idsEqual(id, senderId));
    sender.sentRequests = sender.sentRequests.filter(id => !idsEqual(id, receiverId));

    await receiver.save();
    await sender.save();

    return res.json(successResponse("Friend request rejected."));
  } catch (err) {
    console.error("rejectRequest error:", err);
    return res.json(errorResponse("Failed to reject request."));
  }
};

/* ============================================================
    UNFRIEND
============================================================ */
export const unfriend = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const targetId = req.params.userId;

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    user.friends = user.friends.filter(id => !idsEqual(id, targetId));
    target.friends = target.friends.filter(id => !idsEqual(id, userId));

    await user.save();
    await target.save();

    return res.json(successResponse("User unfriended."));
  } catch (err) {
    console.error("unfriend error:", err);
    return res.json(errorResponse("Failed to unfriend user."));
  }
};
