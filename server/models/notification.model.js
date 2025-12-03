import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },

    // optional
    type: { type: String, enum: ["info", "warning", "success"], default: "info" },
    isRead: { type: Boolean, default: false },

    created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    updated_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

export default mongoose.model("Notification", notificationSchema);
