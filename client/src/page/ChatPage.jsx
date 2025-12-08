import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
  const [searchParams] = useSearchParams();
  const [conversationId, setConversationId] = useState(() => {
    const urlConvId = searchParams.get('conversation');
    const savedId = localStorage.getItem('selectedConversationId');
    return urlConvId || savedId || null;
  });
  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatParticipants, setNewChatParticipants] = useState("");

  const chatContainerRef = useRef(null);
  const hasValidatedRef = useRef(false);
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const jwtRaw = localStorage.getItem("jwt");
  let user = null;
  let userId = null;

  if (jwtRaw) {
    const parsed = JSON.parse(jwtRaw);
    user = parsed.user || null;
    userId = user?.id || user?._id || null;
  }

  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('selectedConversationId', conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    const urlConvId = searchParams.get('conversation');
    if (urlConvId && urlConvId !== conversationId) {
      setConversationId(urlConvId);
      hasValidatedRef.current = false;
    }
  }, [searchParams]);

  useEffect(() => {
    if (conversations.length === 0 || isLoadingConversations) return;

    setIsLoadingConversations(false);

    if (!conversationId) {
      const targetId = conversations[0]?.conversation_id;
      if (targetId) {
        setConversationId(targetId);
      }
      return;
    }

    if (hasValidatedRef.current) return;

    const isValid = conversations.find(conv => conv.conversation_id === conversationId);
    if (!isValid) {
      const firstId = conversations[0]?.conversation_id;
      setConversationId(firstId);
    }

    hasValidatedRef.current = true;
  }, [conversations, isLoadingConversations, conversationId]);

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
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [conversationId, fetchMessages]);

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
  }, [messages, userId, usersMap]);

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

  const handleCreateConversation = async ({ participant }) => {
    try {
      const payload = {
        type: "private",
        participants: [participant],
        display_name: null
      };

      const res = await createConversation(payload);
      const newConv = res?.data?.data || res?.data || res;

      if (!newConv?.conversation_id) {
        console.error("Invalid conversation response:", newConv);
        return;
      }

      setConversations(prev => {
        const exists = prev.some(c => c.conversation_id === newConv.conversation_id);
        return exists ? prev : [newConv, ...prev];
      });

      setConversationId(newConv.conversation_id);

    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };



  const currentConversation = conversations.find((conv) => conv.conversation_id === conversationId);

  return (
    <div className="d-flex flex-column overflow-hidden" style={{ backgroundColor: '#e3f2fd', height: '85vh' }}>
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <div className="d-none d-lg-block col-lg-4 bg-light border-end p-0" style={{ maxWidth: '350px', overflow: 'hidden' }}>
          <ChatSidebar
            conversations={conversations}
            onSelectConversation={(newId) => {
              setConversationId(newId);
              hasValidatedRef.current = true;
            }}
            onCreateConversation={handleCreateConversation}
            currentConversationId={conversationId}
            friends={user?.friends || []}
            currentUserId={userId}
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
              setConversationId(newId);
              hasValidatedRef.current = true;
            }}
            onCreateConversation={handleCreateConversation}
            currentConversationId={conversationId}
            friends={user?.friends || []}
            currentUserId={userId}
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