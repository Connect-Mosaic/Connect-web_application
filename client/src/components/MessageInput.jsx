// components/MessageInput.jsx (New component as per import)
import React from "react";

function MessageInput({ input, setInput, handleSend }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-top bg-white">
      <div className="input-group">
        <textarea
          className="form-control rounded-pill pe-5"
          rows="1"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ resize: 'none' }}
        ></textarea>
        <button className="btn btn-link text-primary position-absolute end-0 me-3 top-50 translate-middle-y" onClick={handleSend} disabled={!input.trim()}>
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
}

export default MessageInput;