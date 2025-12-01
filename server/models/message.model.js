import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Conversation"
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    content: String,

    type: {
        type: String,
        enum: ["text", "image", "file", "system"],
        default: "text"
    },

    attachments: [
        {
            url: String,
            file_type: String,
            file_name: String,
            size: Number
        }
    ],

    reply_to: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },

    read_by: [mongoose.Schema.Types.ObjectId],

    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },

    timestamp: { type: Date, default: Date.now },
    created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    updated_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
