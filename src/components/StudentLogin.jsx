import React, { useState } from 'react';
import './styles/StudentLogin.css';

const StudentLogin = ({ onClose, onLoginSuccess }) => {
  const [roll, setRoll] = useState('');
  const [error, setError] = useState('');
// in StudentLogin.jsx


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/verify/${roll}`);
      const data = await res.json();

      if (res.ok && data.valid) {
        onLoginSuccess();
        localStorage.setItem('studentRoll', roll); // Updates state in parent
      } else {
        setError('Invalid roll number');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Try again.');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-form-container">
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>Student Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default StudentLogin;
