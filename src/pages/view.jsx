// pages/ViewAttendance.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/view.css';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    const roll = localStorage.getItem('studentRoll');
    if (!roll) {
      console.error('Student not logged in.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/student/${roll}`);
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecords(sorted);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <>
      <div className="attendance-view-container">
        <h2>📖 Your Attendance Records</h2>

        {loading ? (
          <p className="status-msg">Loading...</p>
        ) : records.length === 0 ? (
          <p className="status-msg">No attendance records found.</p>
        ) : (
          <table className="attendance-view-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll</th>
                <th>Department</th>
                <th>Teacher ID</th>
                <th>Subject</th>
                <th>Session ID</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => {
                const ts = new Date(rec.timestamp);
                return (
                  <tr key={i}>
                    <td>{rec.studentName}</td>
                    <td>{rec.studentRoll}</td>
                    <td>{rec.department}</td>
                    <td>{rec.teacherId}</td>
                    <td>{rec.subject}</td>
                    <td>{rec.sessionId}</td>
                    <td>{ts.toLocaleDateString()}</td>
                    <td>{ts.toLocaleTimeString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="back-button-container">
        <button onClick={() => navigate('/')} className="back-button">
          ⬅ Back to Home
        </button>
      </div>
    </>
  );
};

export default ViewAttendance;
