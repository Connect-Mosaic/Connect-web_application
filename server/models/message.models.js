import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },     // You can also store user IDs
  receiver: { type: String, required: true },   // Or ObjectId referencing User
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default mongoose.model("Message", MessageSchema);
