import React, { useState,useRef,useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";




function ChatPage (){
    /*state declaration*/
    const[messages,setMessages] = useState([
        { id: 1, sender: "User 1", text: "Hello" },
        { id: 2, sender: "You", text: "Hi there" },
        { id: 3, sender: "User 2", text: "How is it going?" }
    ]);
    const [input, setInput] = useState("");

    const messagesEndRef = useRef(null);

    /*function to send message*/


    const handleSend = () => {
        if(!input.trim()) return;

        const newMessage = {
            id:messages.length + 1,
            sender: "You",
            text: input
        };

        setMessages([...messages, newMessage]);
        setInput("");
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return(
        <div className="chat-page" style={{display:"flex", gap:"25px",padding:"20px"}}>
            {/*sidebar (placeholder)*/}
            <div className="chat-sidebar" style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}>
                <h3>contact </h3>
                <ul>
                    <li>User1</li>
                    <li>User2</li>

                </ul>

            </div>
            
            {/* main Chat area*/}
            <div style={{ display: "flex", flexDirection: "column" }}>
                {/*ChatWindow*/}
                <div className="chat-window" style={{padding: "10px",border: "1px solid #ccc",height: "350px",width: "450px",overflowY: "auto"}}>
                    { messages.map(msg => (
                        <div key={msg.id} style={{ 
                            marginBottom: "10px",
                            display: "flex",
                            justifyContent: msg.sender === "You" ? "flex-end" : "flex-start"}}>
                            {/*placeholder chat bubble .jsx */}
                            <p style={{
                                padding: "10px",
                                borderRadius: "10px",
                                maxWidth: "70%",
                                background: msg.sender === "You" ? "#DCF8C6" : "#eee"
                                }}>
                                <strong>{msg.sender}: </strong> {msg.text}

                            </p>

                        </div>
                    ))}
                    {/* Auto-scroll target */}
                    <div ref={messagesEndRef} />

                </div>
                {/* Message Input Area */}
                <div className="message-input" style={{ marginTop: "10px" }}>
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
                    style={{ width: "350px",height: "45px",padding: "10px",resize: "none" }}
                    />
                    <button onClick={handleSend}
                        style={{ marginLeft: "5px", padding: "5px 10px" }}>
                            send
                        </button>

                </div>
                
            </div>

        </div>
    );
}
export default ChatPage;