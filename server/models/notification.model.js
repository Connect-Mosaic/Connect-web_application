import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },
    message: { type: String, required: true },

    type: { type: String, enum: ["info", "warning", "success", "friend_request"], default: "info" },

    link: { type: String },
    meta: { type: Object },

    isRead: { type: Boolean, default: false },
}, { 
    timestamps: true  // <-- THIS auto-creates createdAt and updatedAt
});

export default mongoose.model("Notification", notificationSchema);
