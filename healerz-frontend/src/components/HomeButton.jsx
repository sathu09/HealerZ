import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer'
      }}
    >
      Home
    </button>
  );
};

export default HomeButton;
