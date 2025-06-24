import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const terminalText = `FortiTrack is a real-time dispatch and job tracking platform for HVAC teams.
Dispatchers can assign jobs, technicians can update status, and admins oversee operations—all in one secure, cloud-based system.`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formFocused, setFormFocused] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(0);
  const navigate = useNavigate();
  const terminalRef = useRef(null);

  // Measure terminal text height for smooth collapse
  useEffect(() => {
    if (!terminalRef.current) return;
    setTerminalHeight(terminalRef.current.offsetHeight);
  }, []);

  // Typing animation
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
    }, 25);
    return () => clearInterval(typeInterval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-background">
      <svg
        className="login-bg-svg"
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.25,
          animation: "moveBlob 18s ease-in-out infinite alternate"
        }}
      >
        <path
          d="M600,300Q600,400,500,450Q400,500,300,450Q200,400,200,300Q200,200,300,150Q400,100,500,150Q600,200,600,300Z"
          fill="#60a5fa"
        />
      </svg>
      <div className="login-center-container">
        <div
          className={`login-header-row${formFocused ? ' header-drop' : ''}`}
          style={{
            transition: 'transform 0.5s cubic-bezier(.4,0,.2,1)',
            transform: formFocused ? `translateY(${terminalHeight}px)` : 'translateY(0)',
          }}
        >
          <img
            src="/logo.png"
            alt="FortiTrack Logo"
            className="login-logo"
          />
          <div className="stackrefined-banner">
            A <span className="brand">Stackrefined</span> Solution
          </div>
        </div>
        <div
          ref={terminalRef}
          className={`terminal-type-container${formFocused ? ' collapsed' : ''}`}
          style={{
            minHeight: formFocused ? 0 : terminalHeight,
            opacity: formFocused ? 0 : 1,
            transition: 'min-height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s cubic-bezier(.4,0,.2,1)'
          }}
        >
          <span className="typed-terminal">
            {typed}
            <span className="terminal-cursor">{showCursor ? "█" : ""}</span>
          </span>
        </div>
        <form
          onSubmit={handleLogin}
          onFocus={() => setFormFocused(true)}
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFormFocused(false);
          }}
          tabIndex={-1}
          className="login-form"
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
            InputLabelProps={{
              style: {
                color: '#174ea6',
                background: '#fff',
                padding: '0 4px',
                borderRadius: '4px',
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                fontWeight: 700,
                fontSize: '1.08rem',
                letterSpacing: '0.01em',
              }
            }}
            sx={{
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.08rem', sm: '1.12rem' },
              color: '#174ea6',
              backgroundColor: '#f6faff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                fontWeight: 700,
                fontSize: { xs: '1.08rem', sm: '1.12rem' },
                color: '#174ea6',
                backgroundColor: '#f6faff',
                borderRadius: 2,
                '& input': {
                  color: '#174ea6',
                  fontWeight: 700,
                  fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                },
                '& fieldset': {
                  borderColor: 'limegreen',
                },
                '&:hover fieldset': {
                  borderColor: '#2563eb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#174ea6',
                },
              },
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            InputLabelProps={{
              style: {
                color: '#174ea6',
                background: '#fff',
                padding: '0 4px',
                borderRadius: '4px',
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                fontWeight: 700,
                fontSize: '1.08rem',
                letterSpacing: '0.01em',
              }
            }}
            sx={{
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.08rem', sm: '1.12rem' },
              color: '#174ea6',
              backgroundColor: '#f6faff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                fontWeight: 700,
                fontSize: { xs: '1.08rem', sm: '1.12rem' },
                color: '#174ea6',
                backgroundColor: '#f6faff',
                borderRadius: 2,
                '& input': {
                  color: '#174ea6',
                  fontWeight: 700,
                  fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                },
                '& fieldset': {
                  borderColor: 'limegreen',
                },
                '&:hover fieldset': {
                  borderColor: '#2563eb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#174ea6',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              boxShadow: "0 2px 12px rgba(23,78,166,0.10)",
              transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
              '&:hover': {
                background: "linear-gradient(90deg, #174ea6 0%, #2563eb 100%)",
                boxShadow: "0 4px 24px rgba(23,78,166,0.18)",
                transform: "translateY(-2px) scale(1.02)",
              },
              '&:active': {
                background: "linear-gradient(90deg, #174ea6 0%, #2563eb 100%)",
                boxShadow: "0 2px 8px rgba(23,78,166,0.10)",
                transform: "scale(0.98)",
              },
              letterSpacing: "0.04em",
              position: "relative",
              overflow: "hidden",
            }}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
