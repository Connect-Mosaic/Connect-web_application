import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
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
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatParticipants, setNewChatParticipants] = useState("");

  const chatContainerRef = useRef(null); // Ref for the scrollable chat container
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Memoized scroll to bottom function
  const scrollToBottom = useCallback(() => {
    const container = chatContainerRef.current;
    if (container) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }, []);

  // Auto-scroll to bottom using useLayoutEffect for synchronous DOM access
  useLayoutEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Fetch conversations on mount with polling (optimized interval)
  useEffect(() => {
    let isMounted = true;
    const fetchConversations = async () => {
      try {
        const res = await getUserConversations();
        const convs = Array.isArray(res?.data) ? res.data : [];
        if (isMounted) {
          setConversations(convs);

          if (!conversationId && convs.length > 0) {
            setConversationId(convs[0].conversation_id);
          }
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        if (isMounted) setConversations([]);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Increased to 5s to reduce calls
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // No deps to run once

  // Fetch messages for the selected conversation with polling
  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(conversationId);
        const fetchedMessages = Array.isArray(res?.data) ? res.data : [];

        const normalizedMessages = fetchedMessages.map((msg) => ({
          ...msg,
          message_id: msg.message_id || `msg-${Date.now()}-${Math.random()}`,
          timestamp: msg.timestamp || new Date().toISOString(),
        }));

        if (isMounted) {
          setMessages(normalizedMessages);

          // Build users map dynamically (immutable update)
          const senderIds = [...new Set(normalizedMessages.map((m) => m.sender))];
          const newUsersMap = { ...usersMap };
          senderIds.forEach((id) => {
            if (!newUsersMap[id]) {
              newUsersMap[id] = id === userId ? "You" : `User ${id.slice(-4)}`;
            }
          });
          setUsersMap(newUsersMap);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        if (isMounted) setMessages([]);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); // Increased to 1s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [conversationId, userId]); // Deps for correctness without loop

  // Handle sending a message
  const handleSend = async () => {
    const messageContent = input.trim();
    if (!messageContent || !conversationId) return;

    const tempMessage = {
      temp_id: `temp-${Date.now()}-${Math.random()}`,
      sender: userId,
      login_user_id: userId, // Add login_user_id for temp messages to match API structure
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
        // Update temp to sent; polling will replace with real msg
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

  // Handle new chat creation
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

  // Find current conversation for sidebar and chat window
  const currentConversation = conversations.find((conv) => conv.conversation_id === conversationId);

  return (
    <div className="d-flex flex-column overflow-hidden" style={{ backgroundColor: '#6f42c1', height: '85vh' }}>
      {/* Top Navigation - Only one nav bar */}


      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <div className="d-none d-lg-block col-lg-4 bg-light border-end p-0" style={{ maxWidth: '350px', overflow: 'hidden' }}>
          <ChatSidebar
            conversations={conversations}
            onSelectConversation={setConversationId}
            onCreateConversation={handleCreateConversation}
            currentConversationId={conversationId}
          />
        </div>

        {/* Mobile Sidebar Trigger (for responsive) */}
        <button className="d-lg-none btn btn-link p-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#chatSidebar">
          <i className="bi bi-list"></i>
        </button>

        {/* Main Chat Area */}
        <div className="flex-grow-1 d-flex flex-column overflow-hidden">
          {conversationId ? (
            <>
              <div
                ref={chatContainerRef}
                className="flex-grow-1 overflow-auto p-3 bg-light position-relative"
                style={{ backgroundColor: '#e3f2fd' }}
              >
                <ChatWindow
                  messages={messages}
                  usersMap={usersMap}
                  currentConversation={currentConversation}
                />
              </div>

              {/* Input */}
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
                <p>Select a conversation to start chatting.</p>
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
            onSelectConversation={setConversationId}
            onCreateConversation={handleCreateConversation}
            currentConversationId={conversationId}
          />
        </div>
      </div>

      {/* Bottom Social Icons - Only for mobile, non-nav */}
      <div className="d-lg-none bg-light border-top p-2 fixed-bottom">
        <div className="d-flex justify-content-around align-items-center">
          <a href="#" className="text-decoration-none"><i className="bi bi-facebook fs-4"></i></a>
          <a href="#" className="text-decoration-none"><i className="bi bi-instagram fs-4"></i></a>
          {/* Add more icons if needed */}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;