import React, { useContext, useEffect, useState } from "react";
import { analyticsLogo, layoutLogo, logoutLogo, promanageLogo, settingsLogo } from "../utils/export";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import '../CSS/Analytics.css'
import { userData } from "../services/user.js";
import LogoutConfirmation from "../components/LogoutConfirmation.jsx";

function Analytics() {
    const navigate = useNavigate();
    const [analyticsData, setAnalyticsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    

    useEffect(() => {
      const token = localStorage.getItem("user-token");
      getAnalyticsData(token);
    },[])

    const handleLogoutClick = () => {
      setShowLogoutConfirmation(true);
    };
  
    const handleConfirmLogout = () => {
      localStorage.removeItem("user-token");
      navigate('/login');
      setShowLogoutConfirmation(false);
    };
  
    const handleCancelLogout = () => {
      setShowLogoutConfirmation(false);
    };

    const getAnalyticsData = async (token) => {
      try {
        const response = await userData(token);

        if(response.success === true) {
          setAnalyticsData(response.data.analytics);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    

  if(loading) {
    return <div>Loading...</div>
  }
  
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
            <button type="button" className="logout-btn" onClick={handleLogoutClick}>
              <img src={logoutLogo} alt="" />
              <h4>Log Out</h4>
            </button>
          </div>
        </div>
      </div>
      <div className="analytics">
        <h1>Analytics</h1>
        <div className="data-container">
          <div className="status-list">
            <ul className="list" >
              <li><div><span className="bullet" ></span>Backlog Tasks</div> <span className="number" >{analyticsData.backlogTasks}</span></li>
              <li><div><span className="bullet" ></span>To-do Tasks</div><span className="number" >{analyticsData.todoTasks}</span></li>
              <li><div><span className="bullet" ></span>In-Progress Tasks</div> <span className="number" >{analyticsData.inProgressTasks}</span></li>
              <li><div><span className="bullet" ></span>Completed Tasks</div> <span className="number" >{analyticsData.doneTasks}</span></li>
            </ul>
          </div>

          <div className="priority-list">
          <ul className="list" >
              <li><div><span className="bullet" ></span>Low Priority</div>  <span className="number" >{analyticsData.lowPriorityTasks}</span></li>
              <li><div><span className="bullet" ></span>Moderate Priority</div> <span className="number" >{analyticsData.moderatePriorityTasks}</span></li>
              <li><div><span className="bullet" ></span>High Priority </div><span className="number" >{analyticsData.highPriorityTasks}</span></li>
              <li><div><span className="bullet" ></span>Due Date Tasks</div> <span className="number" >{analyticsData.dueDateTasks}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <LogoutConfirmation 
        isOpen={showLogoutConfirmation}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}

export default Analytics;
