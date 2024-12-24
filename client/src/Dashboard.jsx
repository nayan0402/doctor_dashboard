import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Wallet, HelpCircle, LogOut, UserPlus } from 'lucide-react';
import PatientForm from './PatientForm';
import Patients from './Patients';
import Help from './Help';
import './Dashboard.css';
import Payment from './Payment';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  // Check URL parameters for success or canceled payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('success');
    if (paymentSuccess === 'true') {
      setActiveSection('payment');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
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
          </>
        );
      case 'patients':
        return <Patients />;
      case 'help':
        return <Help />;
      case 'payment':
        return <Payment />;
      default:
        return null;
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
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveSection('patients')}
          >
            <Users className="nav-icon" />
            <span>Patients</span>
          </button>

          <button 
            className={`nav-item ${activeSection === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveSection('payment')}
          >
            <Wallet className="nav-icon" />
            <span>Payment</span>
          </button>

          <button 
            className={`nav-item ${activeSection === 'help' ? 'active' : ''}`}
            onClick={() => setActiveSection('help')}
          >
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
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Dashboard;
