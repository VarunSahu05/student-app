import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <div className="card-container">
        <div
          className="dashboard-card"
          onClick={() => navigate('/view')}
          style={{ cursor: 'pointer' }}
        >
          View Attendance
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate('/mark')}
          style={{ cursor: 'pointer' }}
        >
          Mark Attendance
        </div>
      </div>
    </div>
  );
};

export default Dashboard;