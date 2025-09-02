import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/UnauthorizedPage';
import PredictorPage from './pages/PredictorPage';
import EHRPage from './pages/Ehrpage'; // ✅ Import the new page
import HomePage from './components/HomePage';
import PatientHistory from './pages/PatientHistory';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Doctor can view patient's history */}
        <Route path="/doctor/history/:email" element={<PatientHistory />} />

        {/* Predictor Page - for Patients only */}
        <Route
          path="/predictor"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PredictorPage />
            </ProtectedRoute>
          }
        />

        {/* EHR Page - for Patients only */}
        <Route
          path="/ehr"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <EHRPage />
            </ProtectedRoute>
          }
        />

        {/* Role-based Dashboards */}
        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
