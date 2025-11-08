import React from "react";


function ChatWindow (){
    return(
        <div className="chatwindoe" style={{padding:"10px",border:"1px",height:"350px",width:"450"}}>
            <p><strong>User 1:</strong> Hello</p>
            <p><strong>You:</strong> Hi there </p>
            <p><strong>User 2:</strong> How is the going?</p>
        </div>

    );
}
export default ChatWindow;