import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  analyticsLogo,
  emailLogo,
  eyeHide,
  eyeView,
  layoutLogo,
  logoutLogo,
  passLogo,
  promanageLogo,
  settingsLogo,
  usernameLogo,
} from "../utils/export";
import "../CSS/Settings.css";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { changePassword, updateEmail, updateName } from "../services/user";
import LogoutConfirmation from "../components/LogoutConfirmation";

function Settings() {
  const navigate = useNavigate();
  const { userDetails } = useContext(AuthContext);
  const [name, setName] = useState(userDetails.name);
  const [email, setEmail] = useState(userDetails.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showLogoutConfirmation,setShowLogoutConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);

      let changeFieldsCount = 0;
      let isPassUpdate = false;

      if (name !== userDetails.name) changeFieldsCount++;
      if (email !== userDetails.email) changeFieldsCount++;
      if (oldPassword && newPassword) {
        isPassUpdate = true;
        changeFieldsCount++;
      }

      if (changeFieldsCount > 1) {
        toast.error("You can only update  one field at a time.");
        return;
      }

      if (changeFieldsCount === 0) {
        toast.error("No changes detected.");
        return;
      }

      if (isPassUpdate) {
        if (!oldPassword || !newPassword) {
          throw new Error("Password is required");
        }

        const response = await changePassword({ oldPassword, newPassword });
        if (response.status === 200) {
          toast.success("Password updated successfully");
          setOldPassword("");
          setNewPassword("");
          navigate("/login");
          return;
        }
      }

      if (name !== userDetails.name) {
        const response = await updateName(name);
        if (response.status === 200) {
          toast.success("Name updated successfully");
          return;
        }
      }

      if (email !== userDetails.email) {
        const response = await updateEmail(email);
        if (response.status === 200) {
          toast.success("Email updated successfully");
          navigate("/login");
          return;
        }
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPassChnage = (e) => {
    setNewPassword(e.target.value);
  };

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
              <h4 onClick={() => navigate("/")}>Board</h4>
            </div>

            <div className="option">
              <img src={analyticsLogo} alt="" />
              <h4 onClick={() => navigate("/analytics")}>Analytics</h4>
            </div>

            <div className="option">
              <img src={settingsLogo} alt="" />
              <h4 onClick={() => navigate("/settings")}>Settings</h4>
            </div>
          </div>

          <div className="bottom-nav-option">
            <button type="button" className="logout-btn" onClick={handleLogoutClick} >
              <img src={logoutLogo} alt="" />
              <h4>Log Out</h4>
            </button>
          </div>
        </div>
      </div>
      <div className="settings">
        <h1>Settings</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-div">
            <img src={usernameLogo} className="input-logo" alt="" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleNameChange}
              value={name}
            />
          </div>

          <div className="input-div">
            <img src={emailLogo} className="input-logo" alt="" />
            <input
              type="text"
              name="email"
              placeholder="Update Email"
              onChange={handleEmailChange}
              value={email}
            />
          </div>

          <div className="input-div">
            <img src={passLogo} className="input-logo" alt="" />
            <input
              type={showOldPass ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowOldPass(!showOldPass)}
            >
              {showOldPass ? (
                <img src={eyeHide} alt="" />
              ) : (
                <img src={eyeView} alt="" />
              )}
            </button>
          </div>

          <div className="input-div">
            <img src={passLogo} className="input-logo" alt="" />
            <input
              type={showNewPass ? "text" : "password"}
              name="password"
              placeholder="New Password"
              onChange={handleNewPassChnage}
              value={newPassword}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowNewPass(!showNewPass)}
            >
              {showNewPass ? (
                <img src={eyeHide} alt="" />
              ) : (
                <img src={eyeView} alt="" />
              )}
            </button>
          </div>
          {error && (
            <p
              className="error"
              style={{
                color: "red",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" className="update-btn">
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
      </div>
      <LogoutConfirmation 
        isOpen={showLogoutConfirmation}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}

export default Settings;
