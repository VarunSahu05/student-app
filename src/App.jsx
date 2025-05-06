import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StudentLogin from './components/StudentLogin';
import Dashboard from './pages/Dashboard';
import View from './pages/view';
import { useLocation } from 'react-router-dom';
import Mark from './pages/mark';

const App = () => {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => setIsLoggedIn(false);

  return (
    <>
      {/* ✅ Navbar shows only on Dashboard page */}
      {location.pathname === '/' && (
        <Navbar
          isLoggedIn={isLoggedIn}
          onLoginClick={handleLoginClick}
          onLogoutClick={handleLogout}
        />
      )}
      {showLogin && <StudentLogin onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />}

      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : null} />
        <Route path="/view" element={<View />} />
        <Route path="/mark" element={<Mark />} />
      </Routes>
    </>
  );
};

export default App;
