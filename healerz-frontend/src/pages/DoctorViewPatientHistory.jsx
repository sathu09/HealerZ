import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DoctorViewPatientHistory = () => {
  const { email } = useParams();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/doctor/patient/${email}`)
      .then(res => res.json())
      .then(data => {
        console.log(" Predictions fetched:", data);
        setPredictions(data.predictions);
      })
      .catch(err => console.error("Failed to fetch predictions", err));
  }, [email]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Prediction History for {email}</h2>
      {predictions.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ul>
          {predictions.map((p, idx) => (
            <li key={idx}>
              <strong>Disease:</strong> {p.disease} <br />
              <strong>Result:</strong> {p.result} <br />
              <strong>Data:</strong> {p.data} <br />
              <strong>Timestamp:</strong> {new Date(p.timestamp).toLocaleString()}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorViewPatientHistory;
