import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const terminalText = `FortiTrack is a real-time dispatch and job tracking platform for HVAC teams.
Dispatchers can assign jobs, technicians can update status, and admins oversee operations—all in one secure, cloud-based system.`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [logoHidden, setLogoHidden] = useState(false);
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    setTyped('');
    setShowCursor(true);
    const typeInterval = setInterval(() => {
      setTyped(terminalText.slice(0, i + 1));
      i++;
      if (i === terminalText.length) {
        clearInterval(typeInterval);
        setShowCursor(true);
      }
    }, 25); // Slightly faster typing effect
    return () => clearInterval(typeInterval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Firebase auth error:', err.code, err.message);
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMouse({ x, y });
  };

  const handleFormFocus = () => setLogoHidden(true);
  const handleFormBlur = (e) => {
    // Only show logo again if focus moves outside the form
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setLogoHidden(false);
    }
  };

  return (
    <div className="login-background">
      <div className="stackrefined-banner">
        A <span className="brand">Stackrefined</span> Solution
      </div>
      <img
        src="/logo.png"
        alt="FortiTrack Logo"
        className={`login-logo${logoHidden ? ' logo-hide' : ''}`}
      />
      <div className="product-info">
        <h1 className="fortitrack-title">FortiTrack</h1>
        <span className="typed-terminal">
          {typed}
          <span className="terminal-cursor">{showCursor ? "█" : ""}</span>
        </span>
      </div>
      <form
        onSubmit={handleLogin}
        onFocus={handleFormFocus}
        onBlur={handleFormBlur}
        tabIndex={-1}
        style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
      >
        <h2 className="login-form-title">Sign In</h2>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: 1,
              '& fieldset': {
                borderColor: 'limegreen',
              },
              '&:hover fieldset': {
                borderColor: 'limegreen',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'limegreen',
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: 1,
              '& fieldset': {
                borderColor: 'limegreen',
              },
              '&:hover fieldset': {
                borderColor: 'limegreen',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'limegreen',
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
