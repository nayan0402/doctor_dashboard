import React, { useState, useEffect } from 'react';
import './Patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorName, setDoctorName] = useState('Doctor');

  useEffect(() => {
    const fetchPatientsAndDoctor = async () => {
      try {
        // Fetch patients
        const patientsResponse = await fetch('http://localhost:5000/api/patients', {
          credentials: 'include',
        });
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
        setFilteredPatients(patientsData);

        // Fetch doctor information
        const doctorResponse = await fetch('http://localhost:5000/api/doctor', {
          credentials: 'include',
        });
        const doctorData = await doctorResponse.json();
        setDoctorName(doctorData.name);

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading(false);
      }
    };

    fetchPatientsAndDoctor();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Once loading is done, make the table visible with smooth transition
      const table = document.querySelector('.patients-table');
      table.classList.add('visible');
    }
  }, [isLoading]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    setSortConfig({ key, direction });
  
    // Remove active class from all columns
    const headers = document.querySelectorAll('.patients-table th');
    headers.forEach((header) => header.classList.add('inactive'));
    
    // Add active class to the clicked column
    const activeHeader = document.querySelector(`.patients-table th:nth-child(${['name', 'age', 'phone', 'medicalIssue'].indexOf(key) + 2})`);
    activeHeader.classList.remove('inactive');
    activeHeader.classList.add('active');
  
    const sortedPatients = [...filteredPatients].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredPatients(sortedPatients);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patients.filter((patient) =>
        patient.name.toLowerCase().includes(query)
      )
    );
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const closePopup = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="patients-container">
      <div className="header-section">
        <div className="header">
          <h1 className="patients-title">Patient Record</h1>
          <p className="subtitle">Here is the record of all your patients.</p>
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {isLoading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? 'active' : ''}>
                  Patient Name
                  <span className={`sort-icon ${sortConfig.key === 'name' ? 'active' : ''}`}>▲▼</span>
                </th>
                <th onClick={() => handleSort('age')} className={sortConfig.key === 'age' ? 'active' : ''}>
                  Age
                  <span className={`sort-icon ${sortConfig.key === 'age' ? 'active' : ''}`}>▲▼</span>
                </th>
                <th>Mobile</th>
                <th>Medical Issue</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr
                  key={patient._id}
                  onClick={() => handlePatientClick(patient)}
                  className="clickable-row"
                >
                  <td>{index + 1}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.medicalIssue.slice(0, 20)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedPatient && (
        <div className={`popup ${selectedPatient ? 'show' : ''}`}>
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>
            <h2>Patient Details</h2>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Address:</strong> {selectedPatient.address}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Medical Issue:</strong> {selectedPatient.medicalIssue}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
