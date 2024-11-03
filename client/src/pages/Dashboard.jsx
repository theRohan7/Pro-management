import React, { useContext, useEffect, useState } from "react";
import {
  promanageLogo,
  analyticsLogo,
  layoutLogo,
  settingsLogo,
  logoutLogo,
  addPeopleLogo,
  collapseAllLogo
} from "../utils/export.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import '../CSS/Dashboard.css';
import { TaskContext } from "../contexts/TaskContext.jsx";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "./TaskForm.jsx";
import moment from "moment";



function Dashboard() {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);
  const { fetchTasks, tasks } = useContext(TaskContext);
  const [filter, setFilter] = useState("This Month");
  const [addTask, setAddTask] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({
    Backlog: false,
    Todo: false,
    'In Progress': false,
    Done: false
  });


  useEffect(() => {
    if(userDetails){
      fetchTasks(filter);
    } else {
      navigate('/login');
    }

  },[userDetails, filter, navigate, fetchTasks]);

 

  const getDate = () => {
    return moment().format(' Do MMM YYYY');
  }
  

  const handleAddTask = () => {
    console.log("add task");
    setAddTask(true);
  }

  const handleCloseAddTask = () => {
    setAddTask(false);
  }

  const handleLogOut = () => {
    localStorage.removeItem("user-token");
    navigate('/login');
  }

  const handleCollapseCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }
  

  const categories = ['Backlog', 'Todo', 'In Progress', 'Done'];

  return (
    <div className="main">
      <div className="side-nav">
        <div className="logo-heading">
          <img src={promanageLogo} alt="" />
          <h2>Pro Manage</h2>
        </div>
        <div className="nav-options">
          <div className="top-nav-option">
            <div className="option">
              <img src={layoutLogo} alt="" />
              <h4 onClick={() => navigate('/')} >Board</h4>
            </div>

            <div className="option">
              <img src={analyticsLogo} alt="" />
              <h4 onClick={() => navigate('/analytics')} >Analytics</h4>
            </div>

            <div className="option">
              <img src={settingsLogo} alt="" />
              <h4 onClick={() => navigate('/settings')} >Settings</h4>
            </div>
          </div>

          <div className="bottom-nav-option">
            <button type="button" className="logout-btn" onClick={handleLogOut}>
              <img src={logoutLogo} alt="" />
              <h4>Log Out</h4>
            </button>
          </div>
        </div>
      </div>
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Welcome! {userDetails?.name} </h2>
          <h3>{getDate()}</h3>
        </div>

        <div className="dashboard-body">
          <div className="board-header">
            <h3>
              Board <img src={addPeopleLogo} alt="" /> <span>Add people</span>{" "}
            </h3>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          <div className="categories-section">
            {categories.map((category, idx) => (
              <div key={idx} className="category">
                <div className="category-header">
                  <h3>{category}</h3>
                  <div className="collapse-add">
                    {category === "Todo" && <i className="ri-add-large-line" onClick={handleAddTask}></i>}
                    <img 
                    src={collapseAllLogo}
                    alt="collapse"
                      onClick={() => handleCollapseCategory(category)}
                      style={{ 
                        cursor: 'pointer',
                        transform: collapsedCategories[category] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                </div>
                <div className="category-body">
                  {tasks.map(
                    (task) =>
                      task.status === category && (
                        <TaskCard task={task} key={task._id} isCollapsed={collapsedCategories[category]} />
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {addTask && <TaskForm onClose={handleCloseAddTask} />}
       
    </div>
  );
}

export default Dashboard;
