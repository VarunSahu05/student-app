import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './styles/mark.css';
import { useNavigate } from 'react-router-dom';

const Mark = () => {
  const [qrData, setQrData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoll = localStorage.getItem('studentRoll');
    if (storedRoll) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${storedRoll}`)
        .then(res => res.json())
        .then(data => setStudentData(data))
        .catch(err => console.error('Error fetching student data:', err));
    }
  }, []);

  const startScanner = () => {
    setQrData(null);
    setShowForm(false);
    setErrorMsg('');

    scannerRef.current.innerHTML = '';
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });

    scanner.render((decodedText) => {
      try {
        const parsed = JSON.parse(decodedText);
        if (!parsed.teacherId || !parsed.subject || !parsed.sessionId || !parsed.department) {
          setErrorMsg('Missing fields in QR data.');
          scanner.clear();
          return;
        }
        setQrData(parsed);
      } catch {
        setErrorMsg('Invalid QR Code format');
      }
      scanner.clear();
    });
  };

  const handleOk = async () => {
    if (!studentData || !qrData) return;
    if (studentData.department !== qrData.department) {
      setErrorMsg("Cannot mark attendance. Department mismatch.");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/id/${qrData.teacherId}`);
      if (!res.ok) {
        setErrorMsg("Error fetching teacher details.");
        return;
      }
      const teacherData = await res.json();
      setQrData((prev) => ({ ...prev, teacherName: teacherData.name })); // Add teacherName to qrData
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      setErrorMsg("Error fetching teacher details.");
    }
  };
  const handleConfirm = async () => {
    const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const attendanceData = {
      studentName: studentData.name,
      studentRoll: studentData.roll,
      department: studentData.department,
      teacherName: qrData.teacherName,
      teacherId: qrData.teacherId,
      subject: qrData.subject,
      sessionId: qrData.sessionId,
      timestamp: new Date().toISOString(),
      date
    };

    try {
      const checkRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentRoll: attendanceData.studentRoll,
          sessionId: attendanceData.sessionId,
          date: attendanceData.date,
        }),
      });

      const checkResult = await checkRes.json();
      if (checkResult.exists) {
        alert('Attendance already marked!');
        return; // Stop further execution
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      const result = await res.json();
      if (res.status === 200) {
        alert('Attendance marked successfully!');
        navigate('/');
      } else {
        alert(result.message || 'Error marking attendance');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
  <>
    <div className="mark-container">
      <h2>Mark Attendance</h2>
      <button className="scanner-btn" onClick={startScanner}>Open Scanner</button>
      <div ref={scannerRef} id="reader" />

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      {qrData && !showForm && (
        <div className="qr-popup">
          <h3>QR Scanned Data</h3>
          <p><b>Teacher ID:</b> {qrData.teacherId}</p>
          <p><b>Subject:</b> {qrData.subject}</p>
          <p><b>Session ID:</b> {qrData.sessionId}</p>
          <p><b>Department:</b> {qrData.department}</p>
          <button className="ok-btn" onClick={handleOk}>OK</button>
        </div>
      )}

      {showForm && (
        <div className="form-box">
          <h3>Confirm Attendance</h3>
          <p><b>Student Name:</b> {studentData.name}</p>
          <p><b>Roll:</b> {studentData.roll}</p>
          <p><b>Department:</b> {studentData.department}</p>
          <p><b>Teacher Name:</b> {qrData.teacherName}</p>
          <p><b>Teacher ID:</b> {qrData.teacherId}</p>
          <p><b>Subject:</b> {qrData.subject}</p>
          <p><b>Session ID:</b> {qrData.sessionId}</p>
          <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
          <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
        </div>
      )}
    </div>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.7rem 1.1rem',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </>
  );
};

export default Mark;
