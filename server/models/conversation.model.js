import mongoose from "mongoose";
const ConversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["private", "group"],
        default: "private"
    },

    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    participants: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            joined_at: Date,
            role: { type: String, enum: ["member", "admin"], default: "member" },
            muted: { type: Boolean, default: false }
        }
    ],

    display_name: String,
    display_image: String,

    last_message: {
        message_id: mongoose.Schema.Types.ObjectId,
        sender_id: mongoose.Schema.Types.ObjectId,
        content: String,
        timestamp: Date
    },

    currently_typing: [mongoose.Schema.Types.ObjectId],

    unread_count: {
        type: Map,
        of: Number
    },

    created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    updated_at: { type: Number, default: () => Math.floor(Date.now() / 1000) }
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;
