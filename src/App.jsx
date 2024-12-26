import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (email, password) => {
     // In a real application, you would validate credentials against a backend
     // For this example, we'll use a simple check based on the email domain
     let role;
     if (email.endsWith('@superadmin.com')) {
       role = 'superadmin';
     } else if (email.endsWith('@admin.com')) {
       role = 'admin';
     } else {
       role = 'employee';
     }
     setIsLoggedIn(true);
     setUserRole(role);
   };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard role={userRole} onLogout={handleLogout} />
      )}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default App;

