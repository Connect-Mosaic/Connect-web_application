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

      const senderId = notif.meta.senderId?.toString?.() || notif.meta.senderId;
      console.log("ACCEPT using senderId:", senderId);

      try {
        await acceptFriendRequestApi(senderId);
        await markNotificationRead(notif.notification_id);
        await loadNotifications();
      } catch (err) {
        console.error("Failed to accept friend request:", err);
      }
    };

    const handleDecline = async (e, notif) => {
      e.stopPropagation();

      const senderId = notif.meta.senderId?.toString?.() || notif.meta.senderId;
      console.log("DECLINE using senderId:", senderId);

      try {
        await rejectFriendRequestApi(senderId);
        await markNotificationRead(notif.notification_id);
        await loadNotifications();
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
          {/* Only show unread notifications */}
          {notifications.filter((n) => !n.is_read).length === 0 ? (
              <div className="notification-item empty">No notifications.</div>
          ) : (
              notifications
                .filter((n) => !n.is_read)
                .map((notif) => (
                  <div
                      key={notif.notification_id}
                      className="notification-item unread"
                      onClick={async () => {
                        if (notif.type === "friend_request") return;

                        await markNotificationRead(notif.notification_id);
                        await loadNotifications();

                        // Default: follow stored link
                        if (notif.link) {
                            window.location.href = notif.link;
                            return;
                        }

                        // Fallback: navigate to conversation if meta contains it
                        if (notif.meta?.conversationId) {
                            window.location.href = `/chat?conversation=${notif.meta.conversationId}`;
                            return;
                        }

                        console.warn("Notification has no navigation target:", notif);
                    }}

                  >
                      <p>{notif.message}</p>
                      <span className="notif-time">
                        {formatTimestamp(notif.created_at || notif.createdAt)}
                      </span>

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
