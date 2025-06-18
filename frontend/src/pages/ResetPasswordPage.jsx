import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await API.post('/reset-password', {
        token,
        new_password: newPassword,
      });
      setMessage(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
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
        <div style={styles.icon}>🔑</div>
        <h2 style={styles.title}>Reset Your Password</h2>
        <p style={styles.subtitle}>Enter and confirm your new password</p>

        {message && <p style={styles.success}>{message}</p>}
        {!message && error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            required
            onChange={(e) => {
              setNewPassword(e.target.value);
              setMessage('');
              setError('');
            }}
            style={styles.input}
            className="glow-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setMessage('');
              setError('');
            }}
            style={styles.input}
            className="glow-input"
          />
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
            <button
              type="submit"
              style={styles.button}
              onClick={handleRipple}
              disabled={!!message}
            >
              Reset Password
            </button>
          </div>
        </form>
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
  success: {
    color: 'green',
    fontSize: '14px',
    marginBottom: '16px',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '16px',
    fontWeight: '600',
  },
};

export default ResetPasswordPage;
