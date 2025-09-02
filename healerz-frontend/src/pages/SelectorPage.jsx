import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';

const SelectorPage = () => {
  const [selectedDisease, setSelectedDisease] = useState('');

  const handleSelect = (e) => {
    setSelectedDisease(e.target.value);
  };

  return (
    <div>
      <h2>Select Disease for Prediction</h2>
      <select value={selectedDisease} onChange={handleSelect}>
        <option value="">-- Select Disease --</option>
        <option value="heart">Heart Disease</option>
        <option value="stroke">Stroke</option>
        <option value="breast">Breast Cancer</option>
        <option value="lung">Lung Cancer</option>
      </select>

      {selectedDisease && (
        <PredictionForm selectedDisease={selectedDisease} />
      )}
    </div>
  );
};

export default SelectorPage;
