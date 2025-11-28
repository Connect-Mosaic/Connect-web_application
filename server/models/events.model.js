import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        description: { type: String, required: true },

        city: { type: String, required: true }, // For filtering by city

        location: { type: String, required: true }, // Full address or venue

        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        },

        date: { type: Date, required: true },

        startTime: { type: String, required: true }, // e.g. "18:00"
        endTime: { type: String, required: true },   // e.g. "21:00"

        interests: {
            type: [String], // Tags: ["coding", "music", "fitness"]
            default: []
        },

        image: { type: String }, // Thumbnail URL

        capacity: { type: Number, required: true },

        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],

        visibility: {
            type: String,
            enum: ["public", "university-only"],
            default: "public"
        }
    },
    {
        timestamps: true // auto create createdAt & updatedAt
    }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
