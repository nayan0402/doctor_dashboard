import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Search, LogOut } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/status', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.isAuthenticated) {
        setUser(data.user);
        navigate('/dashboard');  // Redirect to dashboard if authenticated
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
};

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        credentials: 'include',
      });
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <span className="cross">+</span>
          </div>
          <div className="logo-text">
            <span className="brand-name">INCARE</span>
            <span className="tagline">MISSION IS LIFE</span>
          </div>
        </div>

        <div className="nav-actions">
          <Search className="search-icon" />
          {!loading && (
            user ? (
              <div className="user-section">
                <span className="user-name">{user.displayName}</span>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="logout-icon" />
                </button>
              </div>
            ) : (
              <button
                className="google-login-btn"
                onClick={handleGoogleLogin}
              >
                Sign in with Google
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
