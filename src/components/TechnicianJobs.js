import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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

export default function TechnicianJobs() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);

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
                  <TableCell>{job.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}