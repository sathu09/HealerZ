import React from 'react';
import { Link } from 'react-router-dom';
import medpack from '../assets/medback.png';

const HomePage = () => {
  const wrapperStyle = {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to right,rgb(2, 32, 40), #f1f8ff)',
    fontFamily: 'Segoe UI, sans-serif',
  };

  const navBarStyle = {
    height: '70px',
    backgroundColor: '#1b1f3b',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    position: 'sticky',
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

  const bannerWrapperStyle = {
    width: '100%',
    height: '50vh',
    overflow: 'hidden',
  };

  const bannerStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    animation: 'float 4s ease-in-out infinite',
  };

  const contentContainerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 15px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '90%',
    maxWidth: '600px',
  };

  const headingStyle = {
    fontSize: '32px',
    color: '#007bff',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  const subTextStyle = {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
  };

  const testimonialStyle = {
    backgroundColor: '#ffffff',
    margin: '20px auto',
    padding: '25px 30px',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    borderLeft: '6px solid #007bff',
    maxWidth: '600px',
    textAlign: 'center',
  };

  const testimonialText = {
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#333',
    marginBottom: '12px',
  };

  const testimonialAuthor = {
    fontWeight: 'bold',
    color: '#007bff',
  };

  const featuresSection = {
    padding: '60px 20px',
    backgroundColor: '#fefefe',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const featureGrid = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '40px',
    marginTop: '30px',
    maxWidth: '1200px',
    width: '100%',
  };

  const featureCard = {
    width: '300px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    padding: '20px',
    textAlign: 'center',
  };

  const featureImg = {
    width: '80px',
    height: '80px',
    marginBottom: '15px',
  };

  const footerStyle = {
    backgroundColor: '#1b1f3b',
    color: '#ccc',
    textAlign: 'center',
    padding: '20px 10px',
    fontSize: '14px',
    marginTop: '40px',
  };

  const chatButtonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease-in-out',
    zIndex: 999,
  };

  const keyframes = `
    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0); }
    }
  `;

  return (
    <div style={wrapperStyle}>
      <style>{keyframes}</style>

      {/* Navigation Bar */}
      <nav style={navBarStyle}>
        <Link to="/" style={logoStyle}>HealerZ 🩺</Link>
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

      {/* Banner */}
      <div style={bannerWrapperStyle}>
        <img src={medpack} alt="Medpack Banner" style={bannerStyle} />
      </div>

      {/* Welcome Card */}
      <div style={contentContainerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Welcome to HealerZ 🩺</h1>
          <p style={subTextStyle}>
            An AI-powered platform helping patients and doctors manage health smartly. Receive predictive insights, send digital prescriptions, and safeguard sensitive health data—all in one place.
          </p>
        </div>
      </div>

      {/* Doctor Testimonial */}
      <div style={testimonialStyle}>
        <p style={testimonialText}>
          “HealerZ is revolutionizing the way we predict and treat life-threatening conditions like heart disease and stroke.”
        </p>
        <p style={testimonialAuthor}>– Dr. (Mrs) Vithiya Goguldas MBBS (SL)</p>
      </div>

      {/* Features Section */}
      <section style={featuresSection}>
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '10px' }}>Platform Features</h2>
        <p style={{ maxWidth: '800px', textAlign: 'center', fontSize: '16px', color: '#666' }}>
          HealerZ offers modern AI-powered features to assist both patients and healthcare professionals.
        </p>

        <div style={featureGrid}>
          <div style={featureCard}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992651.png"
              alt="Calculator"
              style={featureImg}
            
            />
            <h3> Health Prediction</h3>
            <p>Predict heart disease and stroke risk using patient test data.</p>
          </div>

          <div style={featureCard}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"
              alt="Paper and Pen"
              style={featureImg}
            />
            <h3>Doctor Prescription</h3>
            <p>Doctors can send encrypted digital prescriptions securely.</p>
          </div>

          <div style={featureCard}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/11371/11371853.png"
              alt="Typing Keyboard"
              style={featureImg}
            />
            <h3>Data Encryption</h3>
            <p>All data is protected with AES encryption & role-based access.</p>
          </div>

          <div style={featureCard}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
              alt="Patient Dashboard"
              style={featureImg}
            />
            <h3>Patient-Friendly Email</h3>
            <p>Easy-to-use tools for patients to understand and track health.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        © {new Date().getFullYear()} HealerZ | @ Health with Sathursh 
      </footer>

      {/* Live Chat Floating Button */}
      <button
        style={chatButtonStyle}
        onClick={() => alert('Live chat support coming soon!')}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Live Chat"
      >
        💬
      </button>
    </div>
  );
};

export default HomePage;
