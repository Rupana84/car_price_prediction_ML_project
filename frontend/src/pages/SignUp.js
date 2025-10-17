import React, { useState } from "react";

const SignUp = () => {
  const [user, setUser] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    alert("User registered!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input type="email" placeholder="Email" onChange={e => setUser({ ...user, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setUser({ ...user, password: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
};

export default SignUp;