import React from 'react';
import '../CSS/DeleteConfirm.css';

function DeleteConfirmationDialouge({ isOpen, onConfirm, onCancel }) {
    if(!isOpen) return null;
    return (
        <div className="delete-overlay">
          <div className="delete-box">
            <h3 className="delete-title">Are you sure you want to Delete?</h3>
            <div className="delete-buttons">
              <button className="delete-confirm-btn" onClick={onConfirm}>
                Yes, Delete
              </button>
              <button className="delete-cancel-btn" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
}

export default DeleteConfirmationDialouge
