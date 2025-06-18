import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import API from '../api/axiosConfig';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess(false);

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError('Mobile number must be 10 digits');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await API.post('/signup', {
        ...formData,
        mobile: `+91${formData.mobile}` // Send full number with country code
      });

      setError('');
      setSuccess(true);
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        navigate('/login');
      }, 3000);
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.detail || 'Signup failed. Try again.');
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
    }, 1000);
  };

  return (
    <div style={styles.page}>
      {showConfetti && <Confetti />}
      <div style={styles.card} className="glow-card">
        <div style={styles.icon}>💻</div>
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Join the compiler portal</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>Signup successful! Redirecting...</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
            className="glow-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
            className="glow-input"
          />

          {/* Updated mobile input with +91 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <span style={styles.countryCode}>+91</span>
            <input
              type="tel"
              name="mobile"
              placeholder="10-digit Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength="10"
              pattern="[0-9]{10}"
              required
              style={{ ...styles.input, marginBottom: 0, marginLeft: '8px', flex: 1 }}
              className="glow-input"
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            className="glow-input"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
            className="glow-input"
          />

          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
            <button
              type="submit"
              style={styles.button}
              onClick={handleRipple}
              disabled={success}
            >
              Sign Up
            </button>
          </div>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
  success: {
    color: 'green',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '600',
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
  countryCode: {
    padding: '12px',
    backgroundColor: '#eee',
    borderRadius: '8px',
    fontSize: '15px',
    border: '1px solid #ccc',
  },
};

export default SignupPage;
