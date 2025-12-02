import express from "express";
import Message from "../models/message.models.js";

const router = express.Router();

// GET messages between two users
router.get("/messages", async (req, res) => {
  const { sender, receiver } = req.query;

  if (!sender || !receiver) {
    return res.status(400).json({ error: "sender and receiver are required" });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST a new message
router.post("/messages", async (req, res) => {
  const { sender, receiver, text } = req.body;

  if (!sender || !receiver || !text) {
    return res.status(400).json({ error: "sender, receiver, and text are required" });
  }

  try {
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("Error saving message:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
