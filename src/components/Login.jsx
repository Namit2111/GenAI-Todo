import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://genai-todob.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        alert('Login successful');
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        navigate('/todo');
      } else {
        const errorText = await response.text();
        alert(`Error logging in: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in');
    }
  };

  return (
    <div className="login-bg">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="title">Login</h2>
        <div className="input-wrapper">
          <label className="label-text" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-wrapper">
          <label className="label-text" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button-submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
