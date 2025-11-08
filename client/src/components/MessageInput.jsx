import React from "react";

function MessageInput (){
    return(
        <div className="message-input" style={{marginTop:"10px"}}>
            <input type="text" placeholder="type a message.." style={{ width:"350px",padding:"10px"}}/>
            <button style={{marginLeft:"5px",padding:"5px 10px"}}>Send</button>
        </div>

    );
}
export default MessageInput;