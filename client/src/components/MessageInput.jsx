import React from 'react';

function MessageInput({ input, setInput, handleSend }) {
  return (
    <div className="message-input" style={{ marginTop: '10px' }}>
      <input
        type="text"
        placeholder="Type a message..."
        style={{ width: '350px', padding: '10px' }}
        value={input}
        onChange={(e) => setInput(e.target.value)} // Bind input value to the parent state
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {  // Check if Enter is pressed
            e.preventDefault();  // Prevent default Enter action (new line)
            handleSend();  // Send the message
          }
        }}
      />
      <button
        onClick={handleSend}  // Trigger send on button click
        style={{ marginLeft: '5px', padding: '5px 10px' }}
        disabled={!input.trim()}  // Disable button if input is empty
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
