import React from 'react';

const DashboardPage = () => {
  const role = localStorage.getItem('role');

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>Your role: <strong>{role}</strong></p>
    </div>
  );
};

export default DashboardPage;
