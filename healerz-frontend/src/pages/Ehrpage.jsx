import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EHRPage = () => {
  const [patientSummaries, setPatientSummaries] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    internalDisease: '',
    externalDisease: '',
  });

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSummary = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), ...formData, email: userEmail };
    setPatientSummaries([...patientSummaries, newEntry]);
    setFormData({
      name: '',
      age: '',
      bloodGroup: '',
      internalDisease: '',
      externalDisease: '',
    });
  };

  const handleAddToDoctorDashboard = async () => {
    if (!formData.name || !formData.age || !formData.bloodGroup) {
      alert("Please fill in all patient details before saving.");
      return;
    }

    try {
      const fullPatient = { id: Date.now(), ...formData, email: userEmail };
      const response = await fetch('http://127.0.0.1:5001/savePatientSummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPatient),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Patient summary saved to Doctor Dashboard!');
      } else {
        alert(data.error || 'Failed to save summary.');
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Something went wrong!');
    }
  };

  const navBtn = (color) => ({
    fontSize: '16px',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: color,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(to right, #e0f7fa, #ffffff)',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <nav
        style={{
          height: '70px',
          backgroundColor: '#1b1f3b',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          width: '100%',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#00e5ff', textDecoration: 'none' }}>
          HealerZ 🩺
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" style={navBtn('#007bff')}>Login</Link>
          <Link to="/predictor" style={navBtn('#28a745')}>Predictor</Link>
          <Link to="/register" style={navBtn('#6f42c1')}>Register</Link>
        </div>
      </nav>

      <div
        style={{
          marginTop: '100px',
          padding: '30px',
          backgroundColor: '#fff',
          width: '90%',
          maxWidth: '700px',
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '28px', color: '#1b1f3b', marginBottom: '20px' }}>Patient EHR Form</h1>

        <form onSubmit={handleSaveSummary} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            name="bloodGroup"
            placeholder="Blood Group"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            required
            style={inputStyle}
          />
          <input
            name="internalDisease"
            placeholder="Internal Disease"
            value={formData.internalDisease}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <input
            name="externalDisease"
            placeholder="External Disease"
            value={formData.externalDisease}
            onChange={handleInputChange}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle('#28a745')}>Show Details</button>
          <button type="button" onClick={handleAddToDoctorDashboard} style={buttonStyle('#007bff')}>
            Add to Doctor Dashboard
          </button>
        </form>

        {patientSummaries.length > 0 && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Blood Group</th>
                <th>Internal</th>
                <th>External</th>
              </tr>
            </thead>
            <tbody>
              {patientSummaries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.name}</td>
                  <td>{entry.bloodGroup}</td>
                  <td>{entry.internalDisease}</td>
                  <td>{entry.externalDisease}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer
        style={{
          marginTop: '50px',
          padding: '20px',
          backgroundColor: '#1b1f3b',
          color: '#fff',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <p>&copy; 2025 HealerZ Healthcare. All rights reserved.</p>
      </footer>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  width: '100%',
};

const buttonStyle = (color) => ({
  padding: '12px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: color,
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold',
});

const tableStyle = {
  marginTop: '30px',
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '15px',
  border: '1px solid #ccc',
};

export default EHRPage;
