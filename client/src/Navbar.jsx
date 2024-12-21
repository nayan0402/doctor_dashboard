import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Search } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <div className="logo-icon">
            <span className="cross">+</span>
          </div>
          <div className="logo-text">
            <span className="brand-name">INCARE</span>
            <span className="tagline">MISSION IS LIFE</span>
          </div>
        </div>
        
        <div className="nav-links">
          <a href="#" className="active">HOME</a>
          <a href="#">PAGES</a>
          <a href="#">SERVICES</a>
          <a href="#">PORTFOLIO</a>
          <a href="#">BLOG</a>
          <a href="#">ELEMENTS</a>
        </div>
        
        <div className="nav-actions">
          <Search className="search-icon" />
          <button className="book-btn">Google LogIn</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
