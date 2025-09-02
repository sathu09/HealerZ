import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiseaseSelector = () => {
  const navigate = useNavigate();

  const handleSelection = (disease) => {
    navigate(`/predict/${disease}`);
  };

  return (
    <div>
      <h2>Select a Disease to Predict</h2>
      <button onClick={() => handleSelection('heart')}>Heart Disease</button>
      <button onClick={() => handleSelection('stroke')}>Stroke</button>
      <button onClick={() => handleSelection('cancer')}>Breast Cancer</button>
      <button onClick={() => handleSelection('lung')}>Lung Cancer</button>
    </div>
  );
};

export default DiseaseSelector;
