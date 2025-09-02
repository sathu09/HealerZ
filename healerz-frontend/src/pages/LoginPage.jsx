import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setCredentials((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', credentials);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', res.data.email);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', credentials.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      switch (res.data.role) {
        case 'patient':
          navigate('/predictor');
          break;
        case 'doctor':
          navigate('/dashboard/doctor');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/unauthorized');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed!';
      setErrorMessage(message);
    }
  };

  // Navbar Styles
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

  // Page Layout
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

  const checkboxContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '14px',
    color: '#333',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
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
        {/* Left Welcome Panel */}
        <div style={leftPane}>
          <h1 style={{ fontSize: '30px', marginBottom: '10px' }}>Welcome to HealerZ!</h1>
          <p style={{ fontSize: '16px', textAlign: 'center' }}>
            Securely log in and access predictive tools, prescriptions, and your medical history in one place.
          </p>
        </div>

        {/* Right Login Form */}
        <div style={rightPane}>
          <form onSubmit={handleLogin}>
            <h2 style={headingStyle}>Login</h2>

            <input
              name="email"
              placeholder="Email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <div style={checkboxContainer}>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  style={{ marginRight: '5px' }}
                />
                Remember Me
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  style={{ marginRight: '5px' }}
                />
                Show Password
              </label>
            </div>

            <button type="submit" style={buttonStyle}>
              Login
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

export default LoginPage;
