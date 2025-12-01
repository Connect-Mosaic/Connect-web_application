import React, { useState,useRef,useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import "./ChatPage.css";




function ChatPage (){
    /*state declaration*/
    const[messages,setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedUser, setSelectedUser] = useState(null); // current chat user

    const activeUser = "You";

    // message for selected user
    useEffect(() => {
        if (!selectedUser) return;
        fetch(`http://localhost:5000/api/messages?sender=${activeUser}&receiver=${selectedUser}`)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error(err));
    } , [selectedUser]);



    /*function to send message*/
    const handleSend = async() => {
        if(!input.trim() || !selectedUser) return;

        const newMessage = {
            sender: activeUser,
            text: input,
            receiver: selectedUser, 
        };

        setMessages((prev) => [...prev, newMessage]);;
        setInput("");

        try{await fetch("http://localhost:5000/api/messages",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMessage)
    });} catch(err){
        console.error(err);
    }
    };
    
    return(
        <div className="chat-page">
            {/*sidebar*/}
            <div className="chat-sidebar">
                <ChatSidebar onSelectUser={setSelectedUser}/>

            </div>
            
            {/* main Chat area*/}
            <div className="chat-main">
                {!selectedUser ? (
                    <div className="chat-window placeholder">
                        <h3>Select a user to start chatting</h3>
                    </div>
                ): (
                    <>

                     {/*ChatWindow*/}
                    <ChatWindow messages={messages} activeUser={activeUser} />
               
                
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
                </>
                )}
            </div>

        </div>
    );
}
export default ChatPage;