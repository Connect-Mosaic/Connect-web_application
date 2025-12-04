import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from "../helpers/apiResponse.js";
import Event from "../models/events.model.js";
import User from "../models/user.model.js";

/* ================================================================
    Helper: Determine relationship between logged-in user and target
================================================================ */
async function getRelationship(currentUser, targetId) {
    if (!currentUser) return "none";
    if (currentUser._id.toString() === targetId.toString()) return "self";

    if (currentUser.friends?.includes(targetId)) return "friends";
    if (currentUser.sentRequests?.includes(targetId)) return "requested";
    if (currentUser.receivedRequests?.includes(targetId)) return "pending";

    return "none";
}

/* ================================================================
    SEARCH CONTROLLER — FIXED WITH RELATIONSHIPS + EVENT JOIN STATE
================================================================ */
const search = async (req, res) => {
    try {
        console.log(
            "[Search] search called with query:",
            req.query.q,
            "by user id:",
            req.auth.userId
        );

        const query = req.query.q;
        if (!query) {
            return res
                .status(400)
                .json(errorResponse('Search query parameter "q" is required'));
        }

        /* ------------------------------------------------------------
            Load logged-in user for relationship and join detection
        ------------------------------------------------------------ */
        const currentUser = await User.findById(req.auth.userId)
            .select("friends sentRequests receivedRequests")
            .lean();

        /* ------------------------------------------------------------
            Search users
        ------------------------------------------------------------ */
        let userResults = await User.find({
            $or: [
                { first_name: { $regex: query, $options: "i" } },
                { last_name: { $regex: query, $options: "i" } },
            ],
        })
            .select(
                "first_name last_name email university program interests location profile_picture"
            )
            .lean();

        /* ⭐ Remove logged-in user from results ⭐ */
        if (currentUser) {
            userResults = userResults.filter(
                (u) => u._id.toString() !== req.auth.userId.toString()
            );
        }

        /* Attach relationship state */
        for (let u of userResults) {
            u.relationship = await getRelationship(currentUser, u._id);
        }

        /* ------------------------------------------------------------
            Search events
        ------------------------------------------------------------ */
        let eventResults = await Event.find({
            title: { $regex: query, $options: "i" },
        })
            .select(
                "title location date startTime endTime interests image participants organizer"
            )
            .populate("organizer", "first_name last_name email")
            .lean();

        /* ⭐ Convert ObjectId → string for participants ⭐ */
        eventResults = eventResults.map((ev) => ({
            ...ev,
            participants: ev.participants?.map((p) => p.toString()) || [],
        }));

        /* ⭐ Add eventState for frontend (joined / none) ⭐ */
        const myId = req.auth.userId?.toString();

        eventResults = eventResults.map((ev) => {
            const joined = ev.participants.includes(myId);
            return {
                ...ev,
                eventState: joined ? "joined" : "none",
            };
        });

        /* ------------------------------------------------------------
            Respond
        ------------------------------------------------------------ */
        return res.json(
            successResponse("Search results retrieved successfully", {
                users: userResults,
                events: eventResults,
            })
        );
    } catch (error) {
        console.error("[Search] Error during search:", error);
        return res
            .status(500)
            .json(errorResponse("An error occurred while searching"));
    }
};

export default { search };
