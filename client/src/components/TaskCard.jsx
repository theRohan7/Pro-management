import React, { useContext, useEffect, useState } from "react";
import "../CSS/Taskcard.css";
import { changeTaskStatus, deleteTask, updateTaskChecklists } from "../services/task";
import { TaskContext } from "../contexts/TaskContext";
import toast from "react-hot-toast";
import TaskForm from "../pages/TaskForm";
import moment from "moment";

function TaskCard({ task, isCollapsed }) {
  const { taskStatus, updateTaskChecklist, updateDeleteTask, updateEditedTask } = useContext(TaskContext);
  const [collapseChecklist, setCollapseChecklist] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (isCollapsed) {
      setCollapseChecklist(true);
    }
  }, [isCollapsed]);
 

  const getInitials = (email) => {
  
    return email
      .split("@")[0]
      .slice(0, 2)
      .toUpperCase();
  };
  

  const formateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const allStatus = ["Backlog", "Todo", "In Progress", "Done"];

  const availableStatus = () => {
    return allStatus.filter((status) => status !== task.status);
  };

  const toggleChecklist = async (taskID, idx) => {
    try {
      const response = await updateTaskChecklists(idx, taskID);
      if (response.status === 200) {
        await updateTaskChecklist(response.data.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleStatusChange = async (newStatus, taskId) => {
    try {
      const response = await changeTaskStatus(newStatus, taskId);
      if (response.status === 200) {
        console.log(response.data);
        
        await taskStatus(response.data.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditTask = () => {
    setIsEditing(true);
    setShowOptions(false);
  }

  const handleShareTask = (taskId) => {
   navigator.clipboard.writeText(`${window.location.origin}/shared-task/${taskId}`);
    setShowOptions(false);
    toast.success("Copied to clipboard");
  }

  const handleDeleteTask = async(taskId) => {   
    try {
      const response = await deleteTask(taskId);
      console.log(response.data);
      
      if (response.status === 200) {
        await updateDeleteTask(taskId);
        setShowOptions(false);
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const getDueDateBackground = (task) => {
    
    if (task.status === 'Done') {
      return '#63C05B';
    }
     
    if (
      task.priority === 'High Priority' || 
      (task.dueDate && moment(task.dueDate).isBefore(moment(), 'day'))
    ) {
      return '#CF3636'; 
    }
    
    return '#DBDBDB'; 
  };


  if (isEditing) {
    return (
      <TaskForm 
        onClose={() => setIsEditing(false)}
        isEditing={true}
        initialData={{
          _id: task._id,
          title: task.title,
          priority: task.priority,
          asignee: task.asignee?.email,
          asigneeId: task.asignee?._id,
          checklists: task.checklists,
          dueDate: task.dueDate,
          status: task.status
        }}
      />
    );
  }

  
  

  return (
    <div className="taskcard">
      <div className="task-header">
        <div className="priority-container">
          <div
            className="circle"
            style={{
              backgroundColor:
                task.priority === "High Priority"
                  ? "#FF2473"
                  : task.priority === "Moderate Priority"
                  ? "#18B0FF"
                  : "#63C05B",
            }}
          ></div>
          <span className="task-priority">{task.priority}</span>{task.asignee && <span className="asignee-avatar" >{task.asignee?.email && getInitials(task.asignee.email)}</span> }
        </div>
        <span
          className="more-options"
          onClick={() => setShowOptions(!showOptions)}
        >
          <i className="ri-more-fill"></i>
        </span>
        <div
          className="task-options"
          style={{ display: showOptions  ? "block" : "none" }}
        >
          <button onClick={() => handleEditTask(task._id)} >Edit</button> <br />
          <button onClick={() => handleShareTask(task._id)} >Share</button>
          <button onClick={() => handleDeleteTask(task._id)} >Delete</button>
        </div>
      </div>
      <h3 className="task-title">
        {task.title.length > 2
          ? `${task.title.substring(0, 20)}...`
          : task.title}
      </h3>
      <div className="checklistsHeader">
        Checklist ({task.checklists.filter((c) => c.completed).length}/
        {task.checklists.length})
        <button onClick={() => setCollapseChecklist(!collapseChecklist)}>
          {collapseChecklist ? (
            <i className="ri-arrow-up-s-line"></i>
          ) : (
            <i className="ri-arrow-down-s-line"></i>
          )}
        </button>
      </div>
      <div className="checklist">
        {task.checklists.map((item, idx) => (
          <div
            key={idx}
            className="checklistItem"
            style={{ display: collapseChecklist ? "none" : "block" }}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleChecklist(task._id, idx)}
            />
            <label>{item.title}</label>
          </div>
        ))}
      </div>

      <div className="task-footer">
        {task.dueDate && 
        <span 
        className="dueDate"
        style={{
          backgroundColor: getDueDateBackground(task)}}
        >
          {formateDate(task.dueDate)}
        </span>
        }
        <div className="statusButtons">
          {availableStatus().map((status, index) => (
            <button
              key={index}
              onClick={() => handleStatusChange(status, task._id)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
