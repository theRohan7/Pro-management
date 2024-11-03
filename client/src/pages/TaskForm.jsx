import React, { useContext, useEffect, useState } from "react";
import { fetchAllUsers } from "../services/user";
import "../CSS/TaskForm.css";
import { createTask, editTask } from "../services/task";
import toast from "react-hot-toast";
import { TaskContext } from "../contexts/TaskContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TaskForm({ onClose, isEditing = false, initialData = null }) {
  const { updateTaskCreated, updateEditedTask } = useContext(TaskContext);

  const [allusers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(initialData?.title || "");
  const [priority, setPriority] = useState(initialData?.priority || "");
  const [asignee, setAsignee] = useState(initialData?.asignee || null);
  const [asigneeId, setAsigneeId] = useState(initialData?.asigneeId || null);
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate) : null);
  const [error, setError] = useState("");
  const [showAsigneeDropdown, setShowAsigneeDropdown] = useState(false);
  const [checklists, setChecklists] = useState(
    initialData?.checklists || [{ title: "", completed: false }]
  );
  const [status, setStatus] = useState(initialData?.status || "Todo");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchAllUsers();
        setAllUsers(response.data.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();

    return () => {
      setAllUsers([]);
      setLoading(true);
    };
  }, []);

  const getInitials = (email) => {
    return email.split("@")[0].slice(0, 2).toUpperCase();
  };

  const handleDropdown = () => {
    setShowAsigneeDropdown(!showAsigneeDropdown);
  };

  const handleAddChecklist = () => {
    setChecklists([...checklists, { title: "", completed: false }]);
  };

  const toggleChecklist = (index) => {
    setChecklists(
      checklists.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleChecklistChnage = (index, value) => {
    setChecklists(
      checklists.map((item, i) =>
        i === index ? { ...item, title: value } : item
      )
    );
  };

  const handleRemoveChecklist = (index) => {
    setChecklists(checklists.filter((_, idx) => idx !== index));
  };

  const hadnleAssignee = (email, asigneeId) => {
    setAsignee(email);
    setAsigneeId(asigneeId);
    setShowAsigneeDropdown(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const data = {
        title: title,
        priority: priority,
        asigneeId: asigneeId,
        status: status,
        checklists: checklists,
        dueDate: dueDate,
      };
      let response;
      if (isEditing) {
        response = await editTask(data, initialData._id);
        if (response.status === 200) {
          await updateEditedTask(response.data.data);
          toast.success("Task updated successfully");
          onClose();
        }
      } else {
        response = await createTask(data);
        if (response.status === 201) {
          await updateTaskCreated(response.data.data);
          toast.success("Task created successfully");
          onClose();
        }
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="overlay">
      <div className="task-form">
        <div className="task-input">
          <label>
            Title
            <span className="required">*</span>
            <input
              type="text"
              placeholder="Enter Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div className="priority-group">
          <label>
            Select priority <span className="required">*</span>
          </label>

          <div className="priority-buttons">
            <button
              onClick={() => setPriority("High Priority")}
              className="priority-btn "
            >
              <div className="circle-div high"></div> HIGH PRIORITY
            </button>
            <button
              onClick={() => setPriority("Moderate Priority")}
              className="priority-btn "
            >
              <div className="circle-div moderate"></div> MODERATE PRIORITY
            </button>
            <button
              onClick={() => setPriority("Low Priority")}
              className="priority-btn "
            >
              <div className="circle-div low"></div> LOW PRIORITY
            </button>
          </div>
        </div>

        <div className="asignee-group">
          <label>Assign to</label>
          <div onClick={handleDropdown} className="dropdown-select">
            <span className="placeholder">{asignee || "Add an assignee"}</span>
            <span className="arrow">
              <i
                style={{ fontSize: "20px" }}
                className="ri-arrow-down-s-line"
              ></i>
            </span>
          </div>

          {showAsigneeDropdown && (
            <div className="dropdown-menu">
              {allusers.map((user) => (
                <div key={user._id} className="dropdown-item">
                  <div className="avatar">{getInitials(user.email)}</div>
                  <span className="user-email">{user.email}</span>
                  <button
                    type="button"
                    className="assign-btn"
                    onClick={() => hadnleAssignee(user.email, user._id)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="checklist-group">
          <div>
            <label>
              Checklist ({checklists.filter((item) => item.completed).length}/
              {checklists.length})
            </label>
            {checklists.map((item, idx) => (
              <div key={idx} className="checklists-item">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklist(idx)}
                />
                <input
                  type="text"
                  placeholder="Task to be done"
                  onChange={(e) => handleChecklistChnage(idx, e.target.value)}
                  value={item.title}
                />
                {idx > 0 && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleRemoveChecklist(idx)}
                  >
                    <i className="ri-delete-bin-5-fill"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddChecklist}
            className="addChecklist-btn"
          >
            + Add new
          </button>
        </div>
        {error && (
          <p
            className="error"
            style={{
              color: "red",
              fontSize: "15px",
              position: "absolute",
              bottom: "10%",
              left: "80%",
              transform: "translateX(-50%)",
            }}
          >
            {error}
          </p>
        )}

        <div className="bottom-actions">
          <div>
            <button 
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="date-btn">
              {dueDate instanceof Date 
    ? dueDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : "Select Due Date"
  }
            </button>
            {showDatePicker && (
              <DatePicker
                selected={dueDate}
                className="date-picker"
                onChange={(date) => {
                  setDueDate(date);
                  setShowDatePicker(false);
                }}
                
              />
            )}
          </div>
          <div>
            {loading ? (
              <h3>Loading...</h3>
            ) : (
              <>
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="button" className="save-btn" onClick={handleSave}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
