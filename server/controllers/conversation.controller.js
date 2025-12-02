import Conversation from "../models/Conversation.js";
import User from "../models/user.model.js";

// List conversations (optional userId)
export const listConversations = async (req, res) => {
  try {
    const userId = req.query.userId;

    // Build query: if userId exists, filter by it; otherwise, return all conversations
    const query = userId ? { members: { $in: [userId] } } : {};

    const conversations = await Conversation.find(query).populate(
      "members",
      "first_name last_name email profile_picture"
    );

    return res.json(conversations);
  } catch (err) {
    console.error("Conversations fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
