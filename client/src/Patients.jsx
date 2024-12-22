import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error('Error fetching patients');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="patients-container">
      <h1>Patients</h1>
      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <div className="patient-list">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <div key={patient._id} className="patient-card">
              <h3>{patient.name}</h3>
              <p>Date of Birth: {patient.dateOfBirth}</p>
              <p>Phone: {patient.phone}</p>
              <p>Email: {patient.email}</p>
              <p>Address: {patient.address}</p>
              <p>Age: {patient.age}</p>
              <p>Medical Issue: {patient.medicalIssue}</p>
            </div>
            ))
          ) : (
            <p>No patients found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Patients;
