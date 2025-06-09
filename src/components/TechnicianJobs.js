import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";

export default function TechnicianJobs() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "jobs"), where("techId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleStatusUpdate = async (jobId, newStatus) => {
    await updateDoc(doc(db, "jobs", jobId), { status: newStatus });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, mt: 2, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.description}</TableCell>
              <TableCell>{job.address}</TableCell>
              <TableCell>
                {job.date && job.date.toDate
                  ? job.date.toDate().toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>
                {job.status === "pending" && (
                  <>
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      sx={{ mr: 1 }}
                      onClick={() => handleStatusUpdate(job.id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => handleStatusUpdate(job.id, "declined")}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {job.status === "accepted" && (
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() => handleStatusUpdate(job.id, "completed")}
                  >
                    Mark Complete
                  </Button>
                )}
                {(job.status === "declined" || job.status === "completed") && (
                  <span>No actions</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}