import React, { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function JobsTable() {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // Fetch all users for UID-to-email mapping
    async function fetchUsers() {
      const usersSnap = await getDocs(collection(db, "users"));
      const userMap = {};
      usersSnap.forEach((doc) => {
        const data = doc.data();
        userMap[doc.id] = data.email || doc.id;
      });
      setUsers(userMap);
    }
    fetchUsers();

    // Listen for jobs
    const unsub = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobsData = [];
      snapshot.forEach((doc) => jobsData.push({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    });
    return () => unsub();
  }, []);

  // Helper to format Firestore Timestamp or JS Date
  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.seconds) return new Date(date.seconds * 1000).toLocaleString();
    return new Date(date).toLocaleString();
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Jobs Table
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Last Updated By</TableCell>
              <TableCell>Last Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{users[job.assignedTo] || job.assignedTo}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{users[job.createdBy] || job.createdBy || "N/A"}</TableCell>
                <TableCell>{formatDate(job.createdAt)}</TableCell>
                <TableCell>{users[job.lastUpdatedBy] || job.lastUpdatedBy || "N/A"}</TableCell>
                <TableCell>{formatDate(job.lastUpdatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}