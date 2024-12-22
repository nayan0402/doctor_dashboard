import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, HelpCircle, LogOut, UserPlus } from 'lucide-react';
import './Dashboard.css';
import PatientForm from './PatientForm';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/status', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          setUserName(data.user.displayName);
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
            <span className="brand-name">ANDREW HOSPITAL</span>
            <span className="tagline">MISSION IS LIFE</span>
          </div>
        </div>

        <div className="nav-links">
          <button className="nav-item active">
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button className="nav-item" onClick={() => navigate('/patients')}>
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
            <h1>Good Morning, {userName ? userName : 'User'}</h1>
            <p>Manage your hospital activities and patient records</p>
          </div>
          <button 
            className="add-patient-btn"
            onClick={() => setIsFormOpen(true)}
          >
            <UserPlus className="btn-icon" />
            Add Patient
          </button>
        </div>

        {isFormOpen && (
          <PatientForm 
            isOpen={isFormOpen} 
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
