import React, { useState } from 'react';

const StrokePredictionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    age: '',
    hypertension: 'no',
    heart_disease: 'no',
    ever_married: 'no',
    work_type: 'Private',
    Residence_type: 'Urban',
    avg_glucose_level: '',
    bmi: '',
    smoking_status: 'never smoked',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); //  call predict API from parent
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Stroke Prediction</h2>

      <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required className="w-full p-2 border rounded" />

      <select name="hypertension" value={formData.hypertension} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="no">Hypertension: No</option>
        <option value="yes">Hypertension: Yes</option>
      </select>

      <select name="heart_disease" value={formData.heart_disease} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="no">Heart Disease: No</option>
        <option value="yes">Heart Disease: Yes</option>
      </select>

      <select name="ever_married" value={formData.ever_married} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="no">Ever Married: No</option>
        <option value="yes">Ever Married: Yes</option>
      </select>

      <select name="work_type" value={formData.work_type} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="Private">Private</option>
        <option value="Self-employed">Self-employed</option>
        <option value="Govt_job">Govt Job</option>
        <option value="children">Children</option>
        <option value="Never_worked">Never Worked</option>
      </select>

      <select name="Residence_type" value={formData.Residence_type} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="Urban">Urban</option>
        <option value="Rural">Rural</option>
      </select>

      <input type="number" step="0.01" name="avg_glucose_level" placeholder="Average Glucose Level" value={formData.avg_glucose_level} onChange={handleChange} required className="w-full p-2 border rounded" />

      <input type="number" step="0.1" name="bmi" placeholder="BMI" value={formData.bmi} onChange={handleChange} required className="w-full p-2 border rounded" />

      <select name="smoking_status" value={formData.smoking_status} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="never smoked">Never Smoked</option>
        <option value="formerly smoked">Formerly Smoked</option>
        <option value="smokes">Smokes</option>
        <option value="Unknown">Unknown</option>
      </select>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Predict Stroke</button>
    </form>
  );
};

export default StrokePredictionForm;
