import React from "react";

export default function AuthCard({
  username,
  password,
  setUsername,
  setPassword,
  doLogin,
  validateToken,
  logout,
  token,
  user,
  loading,
}) {
  return (
    <form onSubmit={doLogin} className="card">
      <h3 className="card-title">1) Login</h3>

      <div className="field">
        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
        />
      </div>
      <div className="field">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="admin123"
        />
      </div>

      <div className="row">
        <button type="submit" disabled={loading}>Login</button>
        <button
          type="button"
          onClick={validateToken}
          disabled={!token || loading}
          className="btn-secondary"
        >
          Validate Token
        </button>
        <button
          type="button"
          onClick={logout}
          disabled={!token || loading}
          className="btn-ghost"
        >
          Logout
        </button>
      </div>

      <small className="muted">
        Token: {token ? token.slice(0, 26) + "…" : "(none)"}{" "}
        {user && ` | user: ${user}`}
      </small>
    </form>
  );
}