import React from 'react';
import { Phone } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      {/* Background Elements */}
      <div className="hero-bg">
        <div className="doctor-overlay"></div>
        <div className="hexagon hex1"></div>
        <div className="hexagon hex2"></div>
        <div className="hexagon hex3"></div>
        <div className="hexagon hex4"></div>
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1>Professional Healthcare for Your Family</h1>
          <p>
            Experience world-class healthcare services with our team of dedicated
            medical professionals. We're committed to providing the highest quality
            of care for you and your loved ones.
          </p>
          <div className="hero-buttons">
            <button className="read-more">Learn More About Us</button>
            <div className="call-help">
              <div className="phone-icon">
                <Phone color="#4e54c8" size={20} />
              </div>
              <div className="call-text">
                <span>Need Help?</span>
                <span className="phone-number">+1 234 567 8900</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="stat-item">
            <h3>15k+</h3>
            <p>Happy Patients</p>
          </div>
          <div className="stat-item">
            <h3>150+</h3>
            <p>Expert Doctors</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Specializations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;