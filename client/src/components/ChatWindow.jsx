import React,{useState} from "react";


function ChatWindow ( { messages = [], activeUser }){
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages]);

    return(
        <div className="chat-window">
            {messages.length === 0 ? (
                <p className="no-messages">No messages yet. Say hi!</p>
            ):(
                messages.map((msg, index) => (
                    <div
                    key={index}
                    className={`chat-message ${msg.sender === activeUser ? "sent" : "received"}`}
                    >
                        <p>
                            <strong>{msg.sender}: </strong>
                            {msg.text}
                        </p>
                 </div>
                ))

            )}
            <div ref={messagesEndRef} />
            </div>
    );
}
export default ChatWindow;