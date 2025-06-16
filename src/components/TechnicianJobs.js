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

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        My Jobs
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No jobs assigned.</TableCell>
              </TableRow>
            ) : (
              jobs.map(job => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.description}</TableCell>
                  <TableCell>
                    <Select
                      value={job.status}
                      onChange={e => handleStatusChange(job.id, e.target.value)}
                      size="small"
                      disabled={updating[job.id]}
                      sx={{ minWidth: 120 }}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {updating[job.id] && (
                      <CircularProgress size={18} sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
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
