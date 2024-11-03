import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  eyeHide,
  eyeView,
  passLogo,
  usernameLogo,
  emailLogo,
  ArtImage,
} from "../utils/export.js";
import { loginUser } from "../services/user.js";
import toast from "react-hot-toast";
import "../CSS/Auth.css";
import { AuthContext } from "../contexts/AuthContext.jsx";

function Login() {

  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (  
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const {  email, password } = formData;
      const response = await loginUser({  email, password });
      if(response.status === 200){
        await login(response.data.data);
        toast.success("Logged in successfully");
        navigate("/");
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
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
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

          <button className="login-btn" type="submit">{loading ? "Loading..." : "Login"}</button>
          <div className="bottom-div">
            <p>Have no account yet ?</p>
            <button onClick={() => navigate("/register")} type="button" >Register</button>
        </div>
        </form>
       
      </div>
    </main>
  );
}

export default Login;
