import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeButton from '../components/HomeButton';
import aboutusImg from '../assets/aboutus.svg';

const api = axios.create({ baseURL: 'http://127.0.0.1:5001/' });

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [localPatients, setLocalPatients] = useState([]);
  const [notes, setNotes] = useState({});
  const [prescriptions, setPrescriptions] = useState({});
  const [editingPrescription, setEditingPrescription] = useState({});
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);

    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        setPatients(response.data.patients);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    const fetchPatientSummaries = async () => {
      try {
        const response = await api.get('/getPatientSummaries');
        const data = response.data;
        setLocalPatients(data);

        const initialPrescriptions = {};
        data.forEach(p => {
          const key = `${p.id}`;
          if (p.prescription) {
            initialPrescriptions[key] = p.prescription;
          }
        });
        setPrescriptions(initialPrescriptions);
      } catch (error) {
        console.error("Error fetching local patients from API:", error);
      }
    };

    fetchPatients();
    fetchPatientSummaries();
  }, []);

  const handleNoteChange = (email, value) => {
    setNotes((prev) => ({ ...prev, [email]: value }));
  };

  const handleSaveNote = async (email) => {
    try {
      await api.post('/doctor/addNote', {
        email,
        note: notes[email] || '',
      });
      alert('Note saved!');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    }
  };

  const handlePrescriptionChange = (key, value) => {
    setEditingPrescription((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePrescription = async (key) => {
    const prescriptionText = editingPrescription[key] || '';
    try {
      setEditingPrescription((prev) => {
        const newEdit = { ...prev };
        delete newEdit[key];
        return newEdit;
      });

      await api.post('/doctor/savePrescription', {
        patient_id: key,
        prescription: prescriptionText,
      });

      setPrescriptions((prev) => ({ ...prev, [key]: prescriptionText }));
      alert('Prescription saved!');
    } catch (error) {
      console.error('Error saving prescription:', error.response || error);
      alert('Failed to save prescription');
    }
  };

  const handleSendPrescription = async (prescriptionContent) => {
    if (!prescriptionContent || prescriptionContent.trim() === "") {
      alert('Prescription is empty. Please add something before sending.');
      return;
    }

    const email = window.prompt("Enter the patient's email address:");
    if (!email) {
      alert('Email is required to send the prescription.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/doctor/sendPrescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_email: email, message: prescriptionContent }),
      });

      const result = await response.json();

      if (response.ok) alert('Prescription sent successfully!');
      else alert(result.error || 'Failed to send prescription.');
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      const response = await api.delete(`/deletePatientSummary/${id}`);
      if (response.status === 200) {
        setLocalPatients((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#121212',
        color: '#e0e0e0',
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: '24px',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          width: '100%',
          maxWidth: '1400px', // limit max width for readability
          boxSizing: 'border-box',
        }}
      >
        <HomeButton />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#90caf9' }}>Doctor Dashboard</h1>
            <p style={{ fontSize: '16px', color: '#b0bec5' }}>Welcome Doctor! View your patient summaries and records.</p>
          </div>
          <img src={aboutusImg} alt="Doctor illustration" style={{ width: '200px', height: 'auto' }} />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', marginBottom: '30px' }}>
          <div style={cardStyle}>
            👥
            <br />
            Total Patients
            <br />
            <strong>{patients.length}</strong>
          </div>
          <div style={cardStyle}>
            📋
            <br />
            EHR Registered Patients
            <br />
            <strong>{localPatients.length}</strong>
          </div>
          <div style={cardStyle}>
            💊
            <br />
            Prescriptions Sent
            <br />
            <strong>{Object.keys(prescriptions).length}</strong>
          </div>
        </div>

        <Section title="All Registered Patients">
          <PatientTable patients={patients} notes={notes} handleNoteChange={handleNoteChange} handleSaveNote={handleSaveNote} />
        </Section>

        <Section title="Patients Added via HealerZ">
          {localPatients.length > 0 ? (
            <LocalPatientTable
              localPatients={localPatients}
              prescriptions={prescriptions}
              editingPrescription={editingPrescription}
              handlePrescriptionChange={handlePrescriptionChange}
              handleSavePrescription={handleSavePrescription}
              handleSendPrescription={handleSendPrescription}
              handleDeletePatient={handleDeletePatient}
            />
          ) : (
            <p style={{ color: '#ccc' }}>No local patients added yet.</p>
          )}
        </Section>
      </div>
    </div>
    
  );
};

const cardStyle = {
  flex: '1',
  backgroundColor: '#1e1e1e',
  padding: '16px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
  textAlign: 'center',
  fontSize: '16px',
  color: '#ffffff',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '24px',
};

const thStyle = {
  border: '1px solid #444',
  padding: '10px',
  backgroundColor: '#263238',
  fontWeight: 'bold',
  color: '#ffffff',
};

const tdStyle = {
  border: '1px solid #444',
  padding: '10px',
  textAlign: 'center',
  backgroundColor: '#1e1e1e',
  color: '#e0e0e0',
  transition: 'background-color 0.3s',
};

const Section = ({ title, children }) => (
  <div style={{ marginTop: '32px' }}>
    <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#90caf9', marginBottom: '12px' }}>{title}</h2>
    {children}
  </div>
);

const PatientTable = ({ patients, notes, handleNoteChange, handleSaveNote }) => (
  <table style={tableStyle}>
    <thead>
      <tr>
        <th style={thStyle}>Name</th>
        <th style={thStyle}>Email ID</th>
        <th style={thStyle}>Action</th>
        <th style={thStyle}>History</th>
        <th style={thStyle}>Notes</th>
      </tr>
    </thead>
    <tbody>
      {patients.map((patient) => (
        <tr
          key={patient.email}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e1e1e')}
        >
          <td style={tdStyle}>{patient.name}</td>
          <td style={tdStyle}>{patient.email}</td>
          <td style={tdStyle}>{patient.disease || 'N/A'}</td>
          <td style={tdStyle}>
            <Link to={`/doctor/history/${patient.email}`} style={{ color: '#64b5f6' }}>
              View
            </Link>
          </td>
          <td style={tdStyle}>
            <textarea
              rows="2"
              value={notes[patient.email] || ''}
              placeholder="Add notes..."
              onChange={(e) => handleNoteChange(patient.email, e.target.value)}
              style={{ width: '100%', padding: '4px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}
            />
            <button
              onClick={() => handleSaveNote(patient.email)}
              style={{ marginTop: '6px', backgroundColor: '#388e3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
            >
              Save Note
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const LocalPatientTable = ({
  localPatients,
  prescriptions,
  editingPrescription,
  handlePrescriptionChange,
  handleSavePrescription,
  handleSendPrescription,
  handleDeletePatient,
}) => (
  <table style={tableStyle}>
    <thead>
      <tr>
        <th style={thStyle}>Tin ID Num</th>
        <th style={thStyle}>Name</th>
        <th style={thStyle}>Age</th>
        <th style={thStyle}>Blood Group</th>
        <th style={thStyle}>Internal Disease</th>
        <th style={thStyle}>External Disease</th>
        <th style={thStyle}>Prescription</th>
        <th style={thStyle}>Delete</th>
      </tr>
    </thead>
    <tbody>
      {localPatients.map((p) => {
        const key = `${p.id}`;
        return (
          <tr
            key={key}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e1e1e')}
          >
            <td style={tdStyle}>{p.id}</td>
            <td style={tdStyle}>{p.name}</td>
            <td style={tdStyle}>{p.age}</td>
            <td style={tdStyle}>{p.bloodGroup || 'N/A'}</td>
            <td style={tdStyle}>{p.internalDisease || 'N/A'}</td>
            <td style={tdStyle}>{p.externalDisease || 'N/A'}</td>
            <td style={tdStyle}>
              {prescriptions[key] && !editingPrescription[key] ? (
                <>
                  <span>{prescriptions[key]}</span>
                  <br />
                  <button
                    onClick={() => handlePrescriptionChange(key, prescriptions[key])}
                    style={{ backgroundColor: '#f57c00', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleSendPrescription(prescriptions[key])}
                    style={{
                      marginLeft: '6px',
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                    }}
                  >
                    Send
                  </button>
                </>
              ) : (
                <>
                  <textarea
                    rows="2"
                    placeholder="Add/Edit prescription..."
                    value={editingPrescription[key] || ''}
                    onChange={(e) => handlePrescriptionChange(key, e.target.value)}
                    style={{ width: '100%', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #555' }}
                  />
                  <button
                    onClick={() => handleSavePrescription(key)}
                    style={{ marginTop: '4px', backgroundColor: '#1976d2', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleSendPrescription(editingPrescription[key])}
                    style={{
                      marginTop: '4px',
                      marginLeft: '6px',
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                    }}
                  >
                    Send
                  </button>
                </>
              )}
            </td>
            <td style={tdStyle}>
              <button
                onClick={() => handleDeletePatient(p.id)}
                style={{ backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
  
);


export default DoctorDashboard;
