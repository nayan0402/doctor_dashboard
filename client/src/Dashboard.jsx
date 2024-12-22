import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, HelpCircle, LogOut } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Fetch the user's name from the backend
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/status', {
          credentials: 'include', // Ensure session cookies are sent
        });
        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          setUserName(data.user.displayName); // Set the name from the backend
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
  
    fetchUserName();
  }, []);
  

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        credentials: 'include',
      });
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <span className="cross">+</span>
          </div>
          <div className="logo-text">
            <span className="brand-name">INCARE</span>
            <span className="tagline">MISSION IS LIFE</span>
          </div>
        </div>

        <div className="nav-links">
          <button className="nav-item active">
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button className="nav-item">
            <Users className="nav-icon" />
            <span>Patients</span>
          </button>

          <button className="nav-item">
            <Wallet className="nav-icon" />
            <span>Payment</span>
          </button>

          <button className="nav-item">
            <HelpCircle className="nav-icon" />
            <span>Help</span>
          </button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>

      <div className="main-content">
        <div className="welcome-banner">
          <div className="banner-content">
            <h1>Good Morning {userName ? userName : 'User'}</h1>
            <p>Manage your hospital activities and patient records</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
