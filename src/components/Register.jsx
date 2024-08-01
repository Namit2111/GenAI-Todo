import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://genai-todob.onrender.com/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      alert('User registered');
      navigate('/login');
    } else {
      alert('Error registering user');
    }
  };

  return (
    <div className="register-bg">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2 className="title">Register</h2>
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
        <button type="submit" className="button-submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
