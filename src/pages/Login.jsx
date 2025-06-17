import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Login.css';

const terminalText = `FortiTrack is a real-time dispatch and job tracking platform for HVAC teams.
Dispatchers can assign jobs, technicians can update status, and admins oversee operations—all in one secure, cloud-based system.`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoHidden, setLogoHidden] = useState(false);
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const terminalRef = useRef(null);

  // Calculate the max height for the terminal text (prevents layout shift)
  const [terminalHeight, setTerminalHeight] = useState(0);

  useEffect(() => {
    // Create a hidden element to measure the full text height
    const el = document.createElement('span');
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    el.style.whiteSpace = 'pre-wrap';
    el.style.fontFamily = "'Fira Mono', 'Consolas', 'Menlo', monospace";
    el.style.fontWeight = '700';
    el.style.fontSize = '1.08em';
    el.style.padding = '0.5em 1em';
    el.style.borderRadius = '8px';
    el.style.background = 'rgba(23, 78, 166, 0.10)';
    el.style.boxShadow = '0 2px 12px rgba(23, 78, 166, 0.08)';
    el.style.width = terminalRef.current ? `${terminalRef.current.offsetWidth}px` : 'auto';
    el.innerText = terminalText;
    document.body.appendChild(el);
    setTerminalHeight(el.offsetHeight);
    document.body.removeChild(el);
  }, []);

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
    setLoading(true); // Start loading
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
    setLoading(false); // End loading
  };

  const handleFormFocus = () => setLogoHidden(true);
  const handleFormBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setLogoHidden(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-header-row">
        <img
          src="/logo.png"
          alt="FortiTrack Logo"
          className={`login-logo${logoHidden ? ' logo-hide' : ''}`}
        />
        <div className="stackrefined-banner">
          A <span className="brand">Stackrefined</span> Solution
        </div>
      </div>
      <div className="product-info">
        <h1 className="fortitrack-title">FortiTrack</h1>
        <div
          className="typed-terminal"
          ref={terminalRef}
          style={{
            minHeight: terminalHeight ? `${terminalHeight}px` : '4.5em',
            display: 'block',
            transition: 'min-height 0.2s',
          }}
        >
          {typed}
          <span className="terminal-cursor">{showCursor ? "█" : ""}</span>
        </div>
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
          disabled={loading}
        >
          {loading ? (
            <CircularProgress
              size={26}
              sx={{
                color: "#fff",
                position: "absolute",
                left: "50%",
                top: "50%",
                marginTop: "-13px",
                marginLeft: "-13px",
              }}
            />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  );
}
