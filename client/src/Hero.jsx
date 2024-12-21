import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Top Doctors Exist<br />In Our Hospital</h1>
          <p>We provide all kinds of medical services to our patients according to their daily needs starting from special conditions</p>
          <div className="hero-buttons">
            <button className="read-more">Read More</button>
            <div className="call-help">
              <div className="phone-icon">📞</div>
              <div className="call-text">
                <span>Call us for help</span>
                <span className="phone-number">(44) 123 456 789</span>
              </div>
            </div>
          </div>
        </div>
        <div className="stats">
          <div className="stat-item">
            <h3>30+</h3>
            <p>Awards Win</p>
          </div>
          <div className="stat-item">
            <h3>100+</h3>
            <p>Experience Members</p>
          </div>
          <div className="stat-item">
            <h3>15k</h3>
            <p>Satisfied Clients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;