import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";

export default function JobsTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    // Listen for jobs
    const unsubscribeJobs = onSnapshot(
      collection(db, "jobs"),
      (querySnapshot) => {
        const jobsData = [];
        querySnapshot.forEach((doc) => {
          jobsData.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsData);
        setLoading(false);
      }
    );

    // Listen for users with technician role
    const unsubscribeTechs = onSnapshot(
      collection(db, "users"),
      (querySnapshot) => {
        const techs = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.role === "technician") {
            techs.push({ id: doc.id, ...data });
          }
        });
        setTechnicians(techs);
      }
    );

    return () => {
      unsubscribeJobs();
      unsubscribeTechs();
    };
  }, []);

  const handleTechChange = async (jobId, newTechId) => {
    await updateDoc(doc(db, "jobs", jobId), { techId: newTechId });
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
            <TableCell>Technician</TableCell>
            <TableCell>Status</TableCell>
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
              <TableCell>
                <Select
                  value={job.techId || ""}
                  onChange={(e) => handleTechChange(job.id, e.target.value)}
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {technicians.map((tech) => (
                    <MenuItem key={tech.id} value={tech.id}>
                      {tech.email || tech.id}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>{job.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}