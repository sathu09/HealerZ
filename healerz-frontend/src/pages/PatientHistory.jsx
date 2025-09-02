import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PatientHistory = () => {
  const { email } = useParams();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:5001/doctor/history/${email}`);
        const data = await response.json();
        if (response.ok) {
          setNote(data.note || 'No notes yet.');
        } else {
          setNote(data.message || 'No history available.');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setNote('Error loading history');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [email]);

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#121212',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#1f1f1f',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          padding: '30px 40px',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            marginBottom: '20px',
            color: '#90caf9',
            fontWeight: '700',
            fontSize: '28px',
            borderBottom: '2px solid #90caf9',
            paddingBottom: '8px',
            textAlign: 'center',
          }}
        >
          Patient History
        </h2>
        <h3
          style={{
            fontWeight: '600',
            fontSize: '18px',
            marginBottom: '15px',
            color: '#bbdefb',
            wordBreak: 'break-word',
            textAlign: 'center',
          }}
        >
          {email}
        </h3>

        {loading ? (
          <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#aaa', textAlign: 'center' }}>
            Loading...
          </p>
        ) : (
          <div
            style={{
              backgroundColor: '#2c2c2c',
              padding: '20px',
              borderRadius: '10px',
              fontSize: '16px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              color: '#e0e0e0',
              boxShadow: 'inset 0 0 5px rgba(0,0,0,0.8)',
              minHeight: '120px',
              textAlign: 'left',
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
