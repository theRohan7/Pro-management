import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  eyeHide,
  eyeView,
  passLogo,
  usernameLogo,
  emailLogo,
  ArtImage,
} from "../utils/export.js";
import { registerUser } from "../services/user.js";
import toast from "react-hot-toast";
import "../CSS/Auth.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmPassChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { name, email, password } = formData;
      const response = await registerUser({ name, email, password });
      if (response.status === 201) {
        toast.success("Registered successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error(error.message);
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="left">
        <img src={ArtImage} alt="" />
        <div className="circle-div"></div>
        <h2>Welcome aboard my friend</h2>
        <p>just a couple of clicks and we start</p>
      </div>
      <div className="right">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-div">
            <img src={usernameLogo} className="input-logo" alt="" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div className="input-div">
            <img src={emailLogo} className="input-logo" alt="" />
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="input-div">
            <img src={passLogo} className="input-logo" alt="" />
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPassChange}
            />
            <button type="button" className="eye-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
              {showConfirmPass ? (
                <img src={eyeHide} alt="" />
              ) : (
                <img src={eyeView} alt="" />
              )}
            </button>
          </div>

          <div className="input-div">
            <img src={passLogo} className="input-logo" alt="" />
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
            />
            <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? (
                <img src={eyeHide} alt="" />
              ) : (
                <img src={eyeView} alt="" />
              )}
            </button>
          </div>
          {error && (
            <p
              className="error-message"
              style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}
            >
              {error}
            </p>
          )}

          <button className="register-btn" type="submit">{loading ? "Loading..." : "Register"}</button>
          <div className="bottom-div">
            <p>Have an account ?</p>
            <button onClick={() => navigate("/login")} type="button" >Login</button>
        </div>
        </form>
       
      </div>
    </main>
  );
}

export default Register;
