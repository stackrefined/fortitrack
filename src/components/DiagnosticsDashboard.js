import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";

function isOverdue(job) {
  if (!job.estimatedCompletion) return false;
  const now = new Date();
  const est = new Date(job.estimatedCompletion);
  return job.status !== "job_completed" && est < now;
}

export default function DiagnosticsDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobsData = [];
      snapshot.forEach(doc => jobsData.push({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    });
    return () => unsub();
  }, []);

  // Filter jobs needing attention
  const pendingConfirmation = jobs.filter(
    job => job.status === "assigned" && !job.confirmedAt
  );
  const overdue = jobs.filter(isOverdue);
  const stuck = jobs.filter(
    job =>
      !["job_completed", "cancelled"].includes(job.status) &&
      job.lastUpdatedAt &&
      (new Date() - new Date(job.lastUpdatedAt.seconds * 1000)) > 1000 * 60 * 60 * 4 // 4 hours
  );

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 900, color: "#174ea6" }}>
        Diagnostics Dashboard
      </Typography>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
        Pending Confirmation
      </Typography>
      <DiagnosticsTable jobs={pendingConfirmation} label="Pending Confirmation" />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
        Overdue Jobs
      </Typography>
      <DiagnosticsTable jobs={overdue} label="Overdue" />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
        Stuck Jobs (No Update > 4h)
      </Typography>
      <DiagnosticsTable jobs={stuck} label="Stuck" />
    </Paper>
  );
}

function DiagnosticsTable({ jobs, label }) {
  if (!jobs.length) return <Typography sx={{ color: "#888", mb: 2 }}>None</Typography>;
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Estimated Completion</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Flag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map(job => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>{job.assignedTo}</TableCell>
              <TableCell>{job.estimatedCompletion || "N/A"}</TableCell>
              <TableCell>
                {job.lastUpdatedAt
                  ? new Date(job.lastUpdatedAt.seconds * 1000).toLocaleString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Chip
                  label={label}
                  color={
                    label === "Overdue"
                      ? "error"
                      : label === "Stuck"
                      ? "warning"
                      : "info"
                  }
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}