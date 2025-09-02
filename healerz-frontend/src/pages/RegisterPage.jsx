import React, { useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [user, setUser] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', user);
      console.log('Registration Successful', res);
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed!');
    }
  };

  // Styles
  const navBarStyle = {
    height: '70px',
    backgroundColor: '#1b1f3b',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00e5ff',
    textDecoration: 'none',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '20px',
  };

  const navLinkBaseStyle = {
    fontSize: '16px',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  };

  const navLoginStyle = {
    ...navLinkBaseStyle,
    backgroundColor: '#007bff',
  };

  const navRegisterStyle = {
    ...navLinkBaseStyle,
    backgroundColor: '#28a745',
  };

  const navHoverStyle = {
    filter: 'brightness(90%)',
  };

  const pageContainer = {
    display: 'flex',
    marginTop: '100px',
    minHeight: 'calc(100vh - 100px)',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const leftPane = {
    flex: 1,
    background: 'linear-gradient(135deg, #1b1f3b, #00e5ff)',
    color: '#fff',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
  };

  const rightPane = {
    flex: 1,
    backgroundColor: '#fff',
    padding: '40px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    maxWidth: '500px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const showPasswordContainer = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '14px',
    color: '#333',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#007bff',
    fontWeight: 'bold',
  };

  return (
    <>
      {/* Navbar */}
      <nav style={navBarStyle}>
        <Link to="/" style={logoStyle}>
          HealerZ 🩺
        </Link>
        <div style={navLinksStyle}>
          <Link
            to="/login"
            style={navLoginStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, navHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, navLoginStyle)}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={navRegisterStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, navHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, navRegisterStyle)}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Page Body */}
      <div style={pageContainer}>
        <div style={leftPane}>
          <h1 style={{ fontSize: '30px', marginBottom: '10px' }}>Welcome Back!</h1>
          <p style={{ fontSize: '16px', textAlign: 'center' }}>
            Join HealerZ and take charge of your health with secure, intelligent tools for care and prediction.
          </p>
        </div>

        <div style={rightPane}>
          <form onSubmit={handleSubmit}>
            <h2 style={headingStyle}>Register</h2>

            <input
              name="name"
              placeholder="Name"
              type="text"
              value={user.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="email"
              placeholder="Email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={user.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <div style={showPasswordContainer}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={toggleShowPassword}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>

            <select name="role" onChange={handleChange} value={user.role} style={inputStyle}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>

            <button type="submit" style={buttonStyle}>
              Register
            </button>
          </form>

          {errorMessage && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
