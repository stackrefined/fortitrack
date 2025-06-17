import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';

const STATUS_OPTIONS = [
  { value: 'assigned', label: 'Assigned' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
];

export default function TechnicianJobs() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [updating, setUpdating] = useState({}); // Track updating state per job
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'jobs'),
      where('assignedTo', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const jobsData = [];
      snapshot.forEach(doc => jobsData.push({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    });
    return () => unsub();
  }, [user]);

  const handleStatusChange = async (jobId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [jobId]: true }));
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: newStatus,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user?.uid || "unknown",
      });
      setSnack({ open: true, message: 'Status updated!', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, message: 'Failed to update status.', severity: 'error' });
    }
    setUpdating((prev) => ({ ...prev, [jobId]: false }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        My Jobs
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Title", "Description", "Status", "Last Updated", "Actions"].map(header => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 900,
                    fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                    color: "#174ea6",
                    fontSize: "1.08rem",
                    background: "#eaf6fb"
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>{job.title}</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>{job.description}</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>
                  <Select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                      color: "#174ea6",
                      backgroundColor: "#f6faff",
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: '1.08rem', sm: '1.12rem' },
                        color: "#174ea6",
                        backgroundColor: "#f6faff",
                        borderRadius: 2,
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
                  >
                    {["assigned", "in progress", "completed"].map(status => (
                      <MenuItem
                        key={status}
                        value={status}
                        sx={{
                          fontWeight: 700,
                          fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                          color: "#174ea6"
                        }}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>
                  {formatDate(job.lastUpdatedAt)}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>
                  {/* Actions here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.message}
      />
    </Paper>
  );
}
