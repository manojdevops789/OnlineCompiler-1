// src/pages/Dashboard.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      {/* Logout Button - Top Left */}
      <div style={styles.logoutContainer}>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          className="glow-button"
        >
          Logout
        </button>
      </div>

      {/* Main Card Content */}
      <div style={styles.card} className="glow-card">
        <div style={styles.iconWrapper}>
          <Sparkles className="text-yellow-500 h-12 w-12 animate-bounce" />
        </div>
        <h1 style={styles.title}>🚀 Welcome to Your Online Compiler</h1>
        <p style={styles.subtitle}>
          Code, Compile, and Run your programs in multiple languages — all in your browser.
        </p>
      </div>

      {/* Glow Styles */}
      <style>
        {`
          .glow-card:hover {
            box-shadow: 0 0 25px rgba(74, 0, 224, 0.4), 0 0 50px rgba(74, 0, 224, 0.2);
            transform: scale(1.02);
            transition: all 0.3s ease-in-out;
          }

          .glow-button:hover {
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
            transform: scale(1.03);
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
  },
  logoutContainer: {
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#333',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
  },
};

export default Dashboard;
