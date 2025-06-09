import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const navigate = useNavigate();

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

  return (
    <div className="login-background">
      <div className="product-info">
        <h1>FortiTrack</h1>
        <p>
          FortiTrack is a real-time dispatch and job tracking platform for HVAC teams.<br />
          Dispatchers can assign jobs, technicians can update status, and admins oversee operations—all in one secure, cloud-based system.
        </p>
      </div>
      <form onSubmit={handleLogin}>
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
