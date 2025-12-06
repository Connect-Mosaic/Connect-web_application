import React, { useEffect, useRef, useState } from "react";
import { getNotifications, markNotificationRead } from "../apis/notification";
import {
  acceptFriendRequestApi,
  rejectFriendRequestApi,
} from "../apis/friend";

import "./NotificationBell.css";

    export default function NotificationBell({ userId }) {
    const [show, setShow] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    function formatTimestamp(ts) {
    if (!ts) return "Unknown time";

    // If it's epoch seconds (number), convert to ms
    if (typeof ts === "number") return new Date(ts * 1000).toLocaleString();

    // If it's ISO string (timestamps:true), convert directly
    return new Date(ts).toLocaleString();
    }
    // -----------------------------
    // NEW — friend request handlers
    // -----------------------------
    const handleAccept = async (e, notif) => {
        e.stopPropagation();

        try {
            await acceptFriendRequestApi(notif.meta.senderId);
            await markNotificationRead(notif.notification_id);
            await loadNotifications(); // refresh UI
        } catch (err) {
            console.error("Failed to accept friend request:", err);
        }
        };

        const handleDecline = async (e, notif) => {
        e.stopPropagation();

        try {
            await rejectFriendRequestApi(notif.meta.senderId);
            await markNotificationRead(notif.notification_id);
            await loadNotifications(); // refresh UI
        } catch (err) {
            console.error("Failed to reject friend request:", err);
        }
        };


  // -----------------------------
  // Load notifications from API
  // -----------------------------
  const loadNotifications = async () => {
    if (!userId) return;

    try {
      const res = await getNotifications();
      console.log("API RESPONSE:", res.data);
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  // Only unread count for badge
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // -----------------------------
  // Close dropdown on outside click
  // -----------------------------
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        className="notification-btn"
        onClick={() => setShow(!show)}
      >
        <i className="bi bi-bell"></i>

        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {show && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="notification-item empty">No notifications yet.</div>
          ) : (
            notifications.map((notif) => (
                <div
                    key={notif.notification_id}
                    className={`notification-item ${notif.is_read ? "read" : "unread"}`}
                    onClick={async () => {
                    
                    // Friend request notifications should NOT trigger default click behavior
                    if (notif.type === "friend_request") return;

                    try {
                        // Existing behavior stays exactly the same
                        await markNotificationRead(notif.notification_id);
                        await loadNotifications();

                        if (notif.link) window.location.href = notif.link;
                    } catch (err) {
                        console.error("Failed to mark notification as read:", err);
                    }
                    }}
                >
                    <p>{notif.message}</p>

                    <span className="notif-time">
                    {formatTimestamp(notif.created_at || notif.createdAt)}
                    </span>


                    {/* ⭐ Only friend requests show buttons */}
                    {notif.type === "friend_request" && (
                    <div className="friend-request-actions">
                        <button
                        className="btn-accept"
                        onClick={(e) => handleAccept(e, notif)}
                        >
                        ✓ Accept
                        </button>

                        <button
                        className="btn-decline"
                        onClick={(e) => handleDecline(e, notif)}
                        >
                        ✕ Decline
                        </button>
                    </div>
                    )}
                </div>
                ))
          )}
        </div>
      )}
    </div>
  );
}
