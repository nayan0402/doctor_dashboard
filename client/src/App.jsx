import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Hero from './Hero';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <div className="content-sections">
        <section className="services">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Cardiology</h3>
              <p>Expert heart care with the latest diagnostic and treatment options.</p>
            </div>
            <div className="service-card">
              <h3>Neurology</h3>
              <p>Comprehensive care for neurological conditions and disorders.</p>
            </div>
            <div className="service-card">
              <h3>Pediatrics</h3>
              <p>Specialized healthcare for infants, children, and adolescents.</p>
            </div>
            <div className="service-card">
              <h3>Orthopedics</h3>
              <p>Treatment for bone, joint, and muscle conditions.</p>
            </div>
          </div>
        </section>
        
        <section className="about">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>24/7 Emergency Care</h3>
              <p>Round-the-clock medical assistance for emergencies.</p>
            </div>
            <div className="feature">
              <h3>Expert Doctors</h3>
              <p>Team of highly qualified and experienced medical professionals.</p>
            </div>
            <div className="feature">
              <h3>Modern Equipment</h3>
              <p>State-of-the-art medical equipment and facilities.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
