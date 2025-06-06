import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Chip, Grid } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Helper to format Firestore timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  if (timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  }
  return String(timestamp);
}

const statusColors = {
  Completed: 'success',
  'In Progress': 'warning',
  Pending: 'default',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch jobs from Firestore
  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobs'));
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load jobs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle status toggle
  const toggleStatus = async (job) => {
    const nextStatus =
      job.status === 'Pending'
        ? 'In Progress'
        : job.status === 'In Progress'
        ? 'Completed'
        : 'Pending';

    try {
      await updateDoc(doc(db, 'jobs', job.id), { status: nextStatus });
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 4,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 900,
          width: '100%',
          borderRadius: 4,
          backgroundColor: '#fff',
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/logo.png" // Replace with your logo path if different
          alt="FortiTrack Logo"
          sx={{ height: 150, mb: 15 }}
        />

        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700' }}>
          FortiTrack Dashboard
        </Typography>

        {user && (
          <Typography variant="subtitle1" sx={{ mb: 3, color: '#555' }}>
            Logged in as: <strong>{user.email}</strong>
          </Typography>
        )}

        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mb: 4 }}>
          Logout
        </Button>

        {loading && <Typography>Loading jobs...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Customer:</strong> {job.customer}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Address:</strong> {job.address}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Technician:</strong> {job.technician}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Timestamp:</strong> {formatTimestamp(job.timestamp)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label={job.status}
                      color={statusColors[job.status] || 'default'}
                      sx={{ fontWeight: '700' }}
                    />
                    <Button size="small" onClick={() => toggleStatus(job)}>
                      Change Status
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
