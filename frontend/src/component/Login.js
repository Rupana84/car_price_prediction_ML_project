import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.email === login.email && savedUser?.password === login.password) {
      localStorage.setItem("isLoggedIn", true);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <h2>login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-box">
            <input type="email" required onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input type="password" required onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <label>Password</label>
          </div>
          <div className="options">
            <label><input type="checkbox" /> Remember Me</label>
            <Link to="/forgot-password">Forget Password</Link>
          </div>
          <button type="submit">login</button>
          <p className="register-link">Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;