// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosConfig';

const LoginPage = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/login', formData);

      // ✅ Check for valid user object
      if (res.data && res.data.email) {
        console.log("Login successful:", res.data);

        // Optionally store user in localStorage
        localStorage.setItem('user', JSON.stringify(res.data));

        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error("Login error:", err.response);
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.className = 'ripple';
    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="glow-card">
        <div style={styles.icon}>🔐</div>
        <h2 style={styles.title}>Login to Your Account</h2>
        <p style={styles.subtitle}>Enter your credentials</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="identifier"
            placeholder="Email or Mobile"
            value={formData.identifier}
            onChange={handleChange}
            required
            style={styles.input}
            className="glow-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            className="glow-input"
          />

          <p style={{ textAlign: 'right', marginBottom: '16px' }}>
            <Link to="/forgot-password" style={{ color: '#4a00e0', fontSize: '14px', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </p>

          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
            <button
              type="submit"
              style={styles.button}
              onClick={handleRipple}
            >
              Login
            </button>
          </div>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>

      <style>
        {`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }

          .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
          }

          .glow-card:hover {
            box-shadow: 0 0 25px rgba(74, 0, 224, 0.4), 0 0 50px rgba(74, 0, 224, 0.2);
            transform: scale(1.02);
            transition: all 0.3s ease-in-out;
          }

          .glow-input:focus {
            border-color: #4a00e0;
            box-shadow: 0 0 8px rgba(74, 0, 224, 0.6);
            outline: none;
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '40px 30px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#333',
  },
  subtitle: {
    fontSize: '14px',
    color: '#777',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4a00e0',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  error: {
    color: 'red',
    marginBottom: '16px',
    fontSize: '14px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#4a00e0',
    fontWeight: '600',
    textDecoration: 'none',
    marginLeft: '4px',
  },
};

export default LoginPage;
