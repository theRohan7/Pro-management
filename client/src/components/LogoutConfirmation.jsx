import React from 'react'

function LogoutConfirmation({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="logout-overlay">
        <div className="logout-box">
          <h3 className="logout-title">Are you sure you want to Logout?</h3>
          <div className="logout-buttons">
            <button className="logout-confirm-btn" onClick={onConfirm}>
              Yes, Logout
            </button>
            <button className="logout-cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>

    );
   
}

export default LogoutConfirmation
