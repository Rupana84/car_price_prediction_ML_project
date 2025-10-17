import React, { useState, useEffect } from "react";
import "./style.css";
import AuthCard from "./component/AuthCard";
import PredictCard from "./component/PredictCard";
import Toast from "./component/Toast";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";
export default function App() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [token, setToken] = useState(localStorage.getItem("jwt") || "");
  const [user, setUser] = useState("");

  const [form, setForm] = useState({
    Year: 2017,
    Present_Price: 9.5,
    Kms_Driven: 42000,
    Fuel_Type: "Petrol",
    Seller_Type: "Dealer",
    Transmission: "Manual",
    Owner: 0,
    Car_Name: "TATA",
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [pred, setPred] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem("jwt", token);
    else localStorage.removeItem("jwt");
  }, [token]);

  const setNotice = (text, type = "info") => {
    setMsg(text);
    setMsgType(type);
  };

  const authHeader = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // ---- API Actions ----
  const doLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Login failed");
      setToken(j.access_token);
      setUser(j.user);
      setNotice("✅ Logged in. Token stored.", "success");
    } catch (err) {
      setToken("");
      setUser("");
      setNotice("❌ " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/validate`, { headers: authHeader() });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail || j.error || "Invalid token");
      setNotice(`✅ Token valid. User: ${j.user}`, "success");
    } catch (err) {
      setNotice("❌ " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const doPredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/predict`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail || j.error || "Prediction failed");
      setPred(j);
      setNotice("✅ Prediction ready.", "success");
    } catch (err) {
      setPred(null);
      setNotice("❌ " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser("");
    setPred(null);
    setNotice("Logged out.", "info");
  };

  return (
    <div className="wrap">
      <header className="header">
        <h1>Car Price Prediction</h1>
        <p className="sub">Secure ML demo • Flask + JWT + React</p>
      </header>

      {msg && <Toast msg={msg} type={msgType} />}

      <div className="grid">
        <AuthCard
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          doLogin={doLogin}
          validateToken={validateToken}
          logout={logout}
          token={token}
          user={user}
          loading={loading}
        />
        <PredictCard
          form={form}
          setForm={setForm}
          doPredict={doPredict}
          pred={pred}
          token={token}
          loading={loading}
        />
      </div>

      <footer className="footer">
        <small>
          Set <code>REACT_APP_API_BASE</code> to your Flask URL (e.g.
          http://localhost:5000).
        </small>
      </footer>
    </div>
  );
}