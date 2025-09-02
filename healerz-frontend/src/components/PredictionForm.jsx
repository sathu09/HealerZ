import React, { useState } from 'react';
import api from '../api/axios';
import HomeButton from '../components/HomeButton';

const formatDiseaseKey = (label) => {
  switch (label) {
    case 'Heart Disease':
      return 'heartDisease';
    case 'Stroke Prediction':
      return 'stroke';
    case 'Breast Cancer':
      return 'breastCancer';
    case 'Lung Cancer':
      return 'lungCancer';
    default:
      return '';
  }
};

const diseaseInputs = {
  'Heart Disease': ['age', 'sex', 'cp', 'trestbps', 'chol', 'restecg', 'fbs', 'oldpeak', 'ca'],
  'Stroke Prediction': [
    'age',
    'hypertension',
    'heart_disease',
    'ever_married',
    'work_type',
    'Residence_type',
    'avg_glucose_level',
    'smoking_status',
  ],
  'Breast Cancer': ['radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean'],
  'Lung Cancer': ['age', 'smoking', 'chronic_disease', 'shortness_of_breath'],
};

const labelStyle = {
  marginBottom: '6px',
  fontWeight: '600',
  color: '#222',
  fontSize: '14px',
};

const inputStyle = {
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.3s',
};

const inputFocusStyle = {
  borderColor: '#007bff',
  boxShadow: '0 0 5px rgba(0,123,255,0.5)',
};

const formStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px 30px',
  marginBottom: '20px',
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const buttonStyle = {
  padding: '12px 25px',
  backgroundColor: '#007bff',
  color: 'white',
  fontWeight: '600',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
};

const resultBoxStyle = {
  marginTop: '30px',
  padding: '15px',
  borderRadius: '8px',
  backgroundColor: '#fff0f0',
  border: '1px solid #ff4d4f',
  color: '#d32020',
  fontWeight: '600',
  fontSize: '16px',
};

const instructionBoxStyle = {
  marginBottom: '30px',
  padding: '20px 25px',
  border: '1px solid #ffa39e',
  borderLeft: '5px solid #ff4d4f',
  borderRadius: '10px',
  backgroundColor: '#fff1f0',
  color: '#5c0000',
  fontSize: '15px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  lineHeight: '1.7',
};

const PredictionForm = ({ selectedDisease }) => {
  const [formData, setFormData] = useState(
    diseaseInputs[selectedDisease]?.reduce((acc, field) => {
      acc[field] = '';
      return acc;
    }, {})
  );
  const [result, setResult] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericFormData = {};

    for (let key in formData) {
      let val = formData[key];

      if (key === 'sex') {
        val = val.toLowerCase() === 'male' ? 1 : val.toLowerCase() === 'female' ? 0 : val;
      } else if (
        ['fbs', 'hypertension', 'heart_disease', 'smoking', 'chronic_disease', 'shortness_of_breath'].includes(key)
      ) {
        val = val.toLowerCase() === 'yes' ? 1 : val.toLowerCase() === 'no' ? 0 : val;
      } else if (key === 'ever_married' || key === 'Residence_type') {
        val = val.toLowerCase() === 'yes' || val.toLowerCase() === 'urban' ? 1 : 0;
      } else if (key === 'work_type') {
        const mapping = {
          'private': 0,
          'self-employed': 1,
          'govt_job': 2,
          'children': 3,
          'never_worked': 4,
        };
        val = mapping[val.toLowerCase()] ?? val;
      } else if (key === 'smoking_status') {
        const smokingMap = {
          'never smoked': 0,
          'formerly smoked': 1,
          'smokes': 2,
          'unknown': 3,
        };
        val = smokingMap[val.toLowerCase()] ?? val;
      } else {
        val = isNaN(val) ? val : parseFloat(val);
      }

      numericFormData[key] = val;
    }

    const payload = {
      disease: formatDiseaseKey(selectedDisease),
      data: numericFormData,
    };

    try {
      const res = await api.post('/predict', payload);
      setResult(res.data.prediction);
    } catch (err) {
      console.error('Prediction request failed:', err.response?.data || err.message);
      alert('Prediction failed. Check console for details.');
    }
  };

  const handleSave = async () => {
    if (!result) {
      alert('No prediction result to save.');
      return;
    }

    const email = localStorage.getItem('email');
    if (!email) {
      alert('Email not found in localStorage. Try logging in again.');
      return;
    }

    const predictionRecord = {
      result,
      disease: formatDiseaseKey(selectedDisease),
      data: formData,
      email,
    };

    try {
      await api.post('/savePrediction', predictionRecord);
      alert('Prediction saved successfully!');
    } catch (err) {
      console.error('Failed to save prediction:', err);
      alert('Failed to save prediction. Try again.');
    }
  };

  const inputFields = diseaseInputs[selectedDisease] || [];

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <HomeButton />
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{selectedDisease} Prediction</h2>

      {selectedDisease === 'Heart Disease' && (
        <div style={instructionBoxStyle}>
          <strong> Instructions for Heart Disease:</strong><br /><br />
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            <li><b>Age</b> Patient age in years</li>
            <li><b>Sex</b> 0 = Female, 1 = Male</li>
            <li><b>CP (Chest Pain Type)</b>:
              <ul style={{ marginTop: '4px', paddingLeft: '18px' }}>
                0 = Typical angina 1 = Atypical angina 2 = Non-anginal pain 3 = Asymptomatic
              </ul>
            </li>
            <li><b>Trestbps</b>: Resting blood pressure 94 -200 (mm Hg)</li>
            <li><b>Chol</b>: Cholesterol level 126 - 564(mg/dL)</li>
            <li><b>RestECG</b>: 0 = Normal, 1 = ST-T abnormality, 2 = Left ventricular hypertrophy</li>
            <li><b>FBS</b>: Fasting blood sugar &gt; 120 mg/dL → 1, else 0</li>
            <li><b>Oldpeak</b>: ST depression 0.0 - 6.2</li>
            <li><b>CA</b>: Number of major vessels (0–3) colored by fluoroscopy<br />
              <span style={{ marginLeft: '10px' }}>0 = Blockage, 3 = No blockage</span>
            </li>
          </ul>
        </div>
      )}

      {selectedDisease === 'Stroke Prediction' && (
        <div style={instructionBoxStyle}>
          <strong>Instructions:</strong><br />
          Hypertension: Yes if you have high blood pressure, else No<br />
          Heart Disease: Yes if diagnosed, else No<br />
          Ever Married: Yes or No<br />
          Work Type: Private, Self-employed, Govt_job, Children, Never_worked<br />
          Residence Type: Urban or Rural<br />
          Average Glucose Level: mg/dL<br />
          Smoking Status: Never smoked, Formerly smoked, Smokes, Unknown
        </div>
      )}

      <form style={formStyle} onSubmit={handleSubmit} autoComplete="off">
        {inputFields.map((field) => (
          <div key={field} style={formGroupStyle}>
            <label htmlFor={field} style={labelStyle}>
              {field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}:
            </label>
            <input
              id={field}
              name={field}
              type="text"
              value={formData[field]}
              onChange={handleChange}
              required
              placeholder={
                field === 'sex'
                  ? 'Male or Female'
                  : ['fbs', 'hypertension', 'heart_disease', 'smoking', 'chronic_disease', 'shortness_of_breath'].includes(field)
                  ? 'Yes or No'
                  : field === 'ever_married'
                  ? 'Yes or No'
                  : field === 'Residence_type'
                  ? 'Urban or Rural'
                  : field === 'work_type'
                  ? 'Private, Self-employed, Govt_job, Children, Never_worked'
                  : field === 'smoking_status'
                  ? 'Never smoked, Formerly smoked, Smokes, Unknown'
                  : field === 'chol'
                  ? 'e.g. 180'
                  : field === 'oldpeak'
                  ? 'e.g. 2.3'
                  : ''
              }
              style={{
                ...inputStyle,
                ...(focusedField === field ? inputFocusStyle : {}),
              }}
              onFocus={() => setFocusedField(field)}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        ))}
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Show Result
        </button>
      </form>

      {result && (
        <div style={resultBoxStyle}>
          <h3>🧬 Prediction Result:</h3>
          <p>{result}</p>
          <button
            onClick={handleSave}
            style={{ ...buttonStyle, marginTop: '10px', backgroundColor: '#d32020', border: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a31818')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#d32020')}
          >
            Save Result
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
