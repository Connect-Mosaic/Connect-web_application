import React from "react";

function ChatSidebar (){
    return(
        <div className="chat-sidebar" style={{width:"250px",borderRight:"1px",padding:"10px"}}>
            <h3>Contacts</h3>
            <ul>
                <li> User 1</li>
                <li> User 2</li>
                <li> User 3</li>
            </ul>

        </div>
    );
}
export default ChatSidebar;