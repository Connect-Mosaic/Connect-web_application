import React, { useState,useRef,useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import "./ChatPage.css";




function ChatPage (){
    /*state declaration*/
    const[messages,setMessages] = useState([]);
    const [input, setInput] = useState("");

    const messagesEndRef = useRef(null);

    /*function to send message*/


    const handleSend = async() => {
        if(!input.trim()) return;

        const newMessage = {sender: "You",text: input };

        setMessages([...messages, newMessage]);
        setInput("");

        try{await fetch("http://localhost:5000/api/messages",{
            method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage)
    });} catch(err){
        console.error(err);
    }
    };
    useEffect(() => {
        fetch("http://localhost:5000/api/messages")
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error(err));
    }, []);
    useEffect(() =>{
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return(
        <div className="chat-page">
            {/*sidebar (placeholder)*/}
            <div className="chat-sidebar">
                <ChatSidebar/>

            </div>
            
            {/* main Chat area*/}
            <div className="chat-main">
                {/*ChatWindow*/}
                <div className="chat-window">
                    { messages.map(msg => (
                        <div 
                        key={msg._id}
                        className={`chat-message ${msg.sender === "You" ? "sent" : "received"}`}>
                            {/*placeholder chat bubble .jsx */}
                            <p >
                                <strong>{msg.sender}: </strong> {msg.text}

                            </p>

                        </div>
                    ))}
                    {/* Auto-scroll target */}
                    <div ref={messagesEndRef} />

                </div>
                {/* Message Input Area */}
                <div className="message-input">
                    <textarea
                    value={input}
                    onChange ={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // prevent newline
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    />
                    <button onClick={handleSend} disabled={!input.trim()}>
                            send
                        </button>

                </div>
                
            </div>

        </div>
    );
}
export default ChatPage;