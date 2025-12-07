import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from 'react-router-dom'; // For handling URL query params
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // For icons if needed
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import MessageInput from "../components/MessageInput.jsx";
import {
  getMessages,
  sendMessage,
  getUserConversations,
  createConversation,
} from "../apis/conversation";

function ChatPage() {
  const [searchParams] = useSearchParams(); // Hook to read URL query params
  const [conversationId, setConversationId] = useState(() => {
    // Initial state: Prioritize URL param, then localStorage
    const urlConvId = searchParams.get('conversation');
    const savedId = localStorage.getItem('selectedConversationId');
    return urlConvId || savedId || null;
  });
  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true); // New: Track loading state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatParticipants, setNewChatParticipants] = useState("");

  const chatContainerRef = useRef(null);
  const hasValidatedRef = useRef(false); // New: Prevent repeated invalidation during manual switches
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Effect to sync conversationId to localStorage
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('selectedConversationId', conversationId);
    }
  }, [conversationId]);

  // Effect to handle URL param changes (e.g., browser navigation)
  useEffect(() => {
    const urlConvId = searchParams.get('conversation');
    if (urlConvId && urlConvId !== conversationId) {
      setConversationId(urlConvId);
      hasValidatedRef.current = false; // Reset validation for new URL
    }
  }, [searchParams]); // Removed conversationId dep to avoid loops

  // Effect to auto-select or validate conversation when conversations load
  useEffect(() => {
    if (conversations.length === 0 || isLoadingConversations) return;

    setIsLoadingConversations(false);

    if (!conversationId) {
      // Auto-select first if no ID
      const targetId = conversations[0]?.conversation_id;
      if (targetId) {
        setConversationId(targetId);
      }
      return;
    }

    // Validate only once (e.g., on initial load or URL change)
    if (hasValidatedRef.current) return;

    const isValid = conversations.find(conv => conv.conversation_id === conversationId);
    if (!isValid) {
      const firstId = conversations[0]?.conversation_id;
      setConversationId(firstId);
    }

    hasValidatedRef.current = true;
  }, [conversations, isLoadingConversations, conversationId]); // Include isLoading to wait for fetch

  // Fetch user conversations periodically
  useEffect(() => {
    let isMounted = true;
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const res = await getUserConversations();
        const convs = Array.isArray(res?.data) ? res.data : [];
        if (isMounted) {
          setConversations(convs);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        if (isMounted) setConversations([]);
      } finally {
        if (isMounted) {
          setIsLoadingConversations(false);
        }
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch messages for the current conversation periodically
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await getMessages(conversationId);
      const fetchedMessages = Array.isArray(res?.data) ? res.data : [];

      const normalizedMessages = fetchedMessages.map((msg) => ({
        ...msg,
        message_id: msg.message_id || `msg-${Date.now()}-${Math.random()}`,
        timestamp: msg.timestamp || new Date().toISOString(),
      }));

      setMessages(normalizedMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [conversationId, fetchMessages]);

  // Update usersMap dynamically based on messages
  useEffect(() => {
    const senderIds = [...new Set(messages.map((m) => m.sender))];
    const newUsersMap = { ...usersMap };
    let hasUpdate = false;
    senderIds.forEach((id) => {
      if (!newUsersMap[id]) {
        newUsersMap[id] = id === userId ? "You" : `User ${id.slice(-4)}`;
        hasUpdate = true;
      }
    });
    if (hasUpdate) {
      setUsersMap(newUsersMap);
    }
  }, [messages, userId, usersMap]); // Added usersMap dep if needed for reactivity

  const handleSend = async () => {
    const messageContent = input.trim();
    if (!messageContent || !conversationId) return;

    const tempMessage = {
      temp_id: `temp-${Date.now()}-${Math.random()}`,
      sender: userId,
      login_user_id: userId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      been_read: false,
      edited: false,
      failed: false,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    try {
      const res = await sendMessage(conversationId, { content: messageContent });
      if (res?.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.temp_id === tempMessage.temp_id
              ? { ...msg, temp_id: null, sent: true }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.temp_id === tempMessage.temp_id ? { ...msg, failed: true } : msg
          )
        );
      }
    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.temp_id === tempMessage.temp_id ? { ...msg, failed: true } : msg
        )
      );
    }
  };

  const handleCreateConversation = async (chatDetails) => {
    try {
      const newConversationData = await createConversation(chatDetails);
      setConversations((prev) => [newConversationData, ...prev]);
      if (!conversationId) {
        setConversationId(newConversationData.conversation_id);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to create conversation. Please try again.");
    }
  };

  const currentConversation = conversations.find((conv) => conv.conversation_id === conversationId);

  return (
    <div className="d-flex flex-column overflow-hidden" style={{ backgroundColor: '#6f42c1', height: '85vh' }}>
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <div className="d-none d-lg-block col-lg-4 bg-light border-end p-0" style={{ maxWidth: '350px', overflow: 'hidden' }}>
          <ChatSidebar
            conversations={conversations}
            onSelectConversation={(newId) => {
              console.log('Switching to conversation:', newId); // Debug log
              setConversationId(newId);
              hasValidatedRef.current = true; // Mark as manual switch
            }}
            onCreateConversation={handleCreateConversation}
            currentConversationId={conversationId}
          />
        </div>

        {/* Mobile Sidebar Trigger */}
        <button className="d-lg-none btn btn-link p-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#chatSidebar">
          <i className="bi bi-list"></i>
        </button>

        {/* Main Chat Area */}
        <div className="flex-grow-1 d-flex flex-column overflow-hidden">
          {conversationId && !isLoadingConversations ? (
            <>
              <div
                // ref={chatContainerRef} // If moved to ChatWindow, can remove
                className="flex-grow-1 overflow-auto p-3 bg-light position-relative"
                style={{ backgroundColor: '#e3f2fd' }}
              >
                <ChatWindow
                  messages={messages}
                  usersMap={usersMap}
                  currentConversation={currentConversation}
                />
              </div>

              <MessageInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
              />
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              <div className="text-center">
                <i className="bi bi-chat-square-text display-1 mb-3"></i>
                <p>{isLoadingConversations ? 'Loading conversations...' : 'Select a conversation to start chatting.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offcanvas for Mobile Sidebar */}
      <div className="offcanvas offcanvas-start d-lg-none" tabIndex="-1" id="chatSidebar" aria-labelledby="chatSidebarLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="chatSidebarLabel">Chats</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <ChatSidebar
            conversations={conversations}
            onSelectConversation={(newId) => {
              console.log('Mobile switching to conversation:', newId); // Debug log
              setConversationId(newId);
              hasValidatedRef.current = true; // Mark as manual switch
            }}
            onCreateConversation={handleCreateConversation}
            currentConversationId={conversationId}
          />
        </div>
      </div>

      {/* Bottom Social Icons */}
      <div className="d-lg-none bg-light border-top p-2 fixed-bottom">
        <div className="d-flex justify-content-around align-items-center">
          <a href="#" className="text-decoration-none"><i className="bi bi-facebook fs-4"></i></a>
          <a href="#" className="text-decoration-none"><i className="bi bi-instagram fs-4"></i></a>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;