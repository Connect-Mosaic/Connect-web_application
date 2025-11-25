import React from "react";
import "./ConfirmModal.css";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="confirm-btn" onClick={() => onConfirm && onConfirm ()}>Confirm</button>

                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}  export default ConfirmModal;