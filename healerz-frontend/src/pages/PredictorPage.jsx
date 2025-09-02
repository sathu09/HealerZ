import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PredictionForm from '../components/PredictionForm';

const diseaseLabels = {
  heartDisease: 'Heart Disease',
  stroke: 'Stroke Prediction',
};

const PredictorPage = () => {
  const [selectedDisease, setSelectedDisease] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const diseaseFromURL = params.get('disease');
    if (diseaseFromURL && diseaseLabels[diseaseFromURL]) {
      setSelectedDisease(diseaseFromURL);
    }
  }, [location]);

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
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
          <Link to="/register" style={navBtn('#28a745')}>Register</Link>
          <Link to="/ehr" style={navBtn('#6f42c1')}>Patient EHR</Link>
        </div>
      </nav>

      <div
        style={{
          marginTop: '100px',
          padding: '30px',
          backgroundColor: '#fff',
          width: '90%',
          maxWidth: '700px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '28px', color: '#1b1f3b', marginBottom: '20px' }}>🩺 Predict Your Health Risk</h1>

        <label htmlFor="disease" style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px', color: '#444' }}>
          Select a Disease:
        </label>
        <select
          id="disease"
          value={selectedDisease}
          onChange={(e) => setSelectedDisease(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          <option value="">Select a disease</option>
          <option value="heartDisease">Heart Disease</option>
          <option value="stroke">Stroke Prediction</option>
        </select>

        {selectedDisease && (
          <div style={{ marginTop: '30px' }}>
            <PredictionForm selectedDisease={diseaseLabels[selectedDisease]} />
          </div>
        )}
      </div>

      <footer
        style={{
          marginTop: '40px',
          backgroundColor: '#1b1f3b',
          color: '#fff',
          padding: '16px 0',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px' }}>
          © {new Date().getFullYear()} HealerZ Healthcare Platform. All rights reserved Sathursh.
        </p>
      </footer>
    </div>
  );
};

const navBtn = (color) => ({
  fontSize: '16px',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: color,
});

export default PredictorPage;
