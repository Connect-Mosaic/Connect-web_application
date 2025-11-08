import React from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";


function ChatPage (){
    return(
        <div className="chat-page" style={{display:"flex", gap:"25px"}}>
            {/*sidebar with contacts*/}
            <ChatSidebar/>
            {/*Chat area*/}
            <div>
                <ChatWindow/>
                <MessageInput/>
            </div>

        </div>
    );
}
export default ChatPage;