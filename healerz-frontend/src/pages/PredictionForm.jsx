import React, { useState } from 'react';
import api from '../api/axios';

const diseaseFields = {
  "Heart Disease": ['age', 'gender', 'cp','trestbps', 'chol', 'fbs', 'oldpeak', 'ca'],
  "Stroke Prediction": ['age', 'hypertension', 'heart_disease', 'bmi'],
  "Breast Cancer": ['radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean'],
  "Lung Cancer": ['smoking', 'yellow_fingers', 'anxiety', 'age']
};

const PredictionForm = ({ selectedDisease }) => {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedData = { ...formData };

    Object.keys(processedData).forEach(key => {
      let val = processedData[key].toLowerCase?.() || processedData[key];

      if (['gender', 'fbs', 'hypertension', 'heart_disease', 'smoking'].includes(key)) {
        processedData[key] = val === 'yes' || val === 'male' ? 1 : val === 'no' || val === 'female' ? 0 : val;
      } else {
        processedData[key] = isNaN(val) ? val : parseFloat(val);
      }
    });

    try {
      const res = await api.post('/predict', {
        disease: selectedDisease,
        data: processedData
      });
      setResult(res.data.prediction);
    } catch (err) {
      console.error(err);
      setResult("Prediction failed.");
    }
  };

  const fields = diseaseFields[selectedDisease] || [];

  // Styles
  const containerStyle = {
    maxWidth: '540px',
    margin: '40px auto',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#222'
  };

  const titleStyle = {
    marginBottom: '28px',
    fontWeight: '700',
    fontSize: '1.8rem',
    textAlign: 'center',
    color: '#004085'
  };

  const formGroupStyle = {
    backgroundColor: '#f9faff',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '20px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '0.95rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #ced4da',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const inputFocusStyle = {
    borderColor: '#007bff',
    boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3'
  };

  const resultStyle = {
    marginTop: '30px',
    padding: '20px',
    borderRadius: '14px',
    backgroundColor: '#e9f7ef',
    border: '1px solid #a3d4a1',
    color: '#2d572c',
    fontWeight: '600',
    fontSize: '1.1rem',
    textAlign: 'center'
  };

  const [focusedField, setFocusedField] = useState(null);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Enter details for {selectedDisease}</h3>
      <form onSubmit={handleSubmit}>

        {fields.map((field) => (
          <div key={field} style={formGroupStyle}>
            <label htmlFor={field} style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              id={field}
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              onFocus={() => setFocusedField(field)}
              onBlur={() => setFocusedField(null)}
              required
              placeholder={
                field === 'gender' ? 'Male or Female' :
                ['fbs', 'hypertension', 'heart_disease', 'smoking'].includes(field) ? 'Yes or No' :
                ''
              }
              style={{ 
                ...inputStyle, 
                ...(focusedField === field ? inputFocusStyle : {}) 
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Show Prediction
        </button>
      </form>

      {result && (
        <div style={resultStyle}>
          <h4>🩺 Prediction Result:</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
