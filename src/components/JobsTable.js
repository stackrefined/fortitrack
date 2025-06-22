import React, { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { logJobChange } from "../utils/jobChangeLogger";
import { useUser } from "../contexts/UserContext";

export default function JobsTable() {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState({});
  const [techs, setTechs] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    // Grab all users so we can show emails instead of just UIDs
    async function fetchUsers() {
      const usersSnap = await getDocs(collection(db, "users"));
      const userMap = {};
      const techList = [];
      usersSnap.forEach((doc) => {
        const data = doc.data();
        userMap[doc.id] = data.email || doc.id;
        if (data.role === "technician") {
          techList.push({ uid: doc.id, email: data.email });
        }
      });
      setUsers(userMap);
      setTechs(techList);
    }
    fetchUsers();

    // Listen for job updates in real time so the table is always fresh
    const unsub = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobsData = [];
      snapshot.forEach((doc) => jobsData.push({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    });
    return () => unsub();
  }, []);

  // Format Firestore Timestamp or JS Date for display in the user's local timezone
  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.seconds) return new Date(date.seconds * 1000).toLocaleString();
    return new Date(date).toLocaleString();
  };

  // When a dispatcher/admin reassigns a job, update the assigned tech and log the change
  const handleReassign = async (job, newTechUid) => {
    const oldTechUid = job.assignedTo;
    await updateDoc(doc(db, "jobs", job.id), {
      assignedTo: newTechUid,
      lastUpdatedAt: new Date(),
      lastUpdatedBy: user?.uid || "unknown",
    });
    // Make a note in the audit log so we know who reassigned the job (and to whom)
    await logJobChange(
      job.id,
      "reassignment",
      oldTechUid,
      newTechUid,
      user?.uid || "unknown"
    );
  };

  // If a job needs to be cancelled, update its status and log the action for transparency
  const handleCancel = async (job) => {
    await updateDoc(doc(db, "jobs", job.id), {
      status: "cancelled",
      lastUpdatedAt: new Date(),
      lastUpdatedBy: user?.uid || "unknown",
    });
    // Log the cancellation so we have a record of who did it and when
    await logJobChange(
      job.id,
      "cancellation",
      job.status,
      "cancelled",
      user?.uid || "unknown"
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{
        fontWeight: 900,
        fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
        color: "#174ea6"
      }}>
        Jobs Table
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Title", "Description", "Assigned To", "Status", "Created By", "Created At", "Last Updated By", "Last Updated At", "Actions"].map(header => (
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
                    value={job.assignedTo}
                    onChange={e => handleReassign(job, e.target.value)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                      color: "#174ea6",
                      backgroundColor: "#f6faff",
                      borderRadius: 2,
                    }}
                  >
                    {techs.map(tech => (
                      <MenuItem key={tech.uid} value={tech.uid}>
                        {tech.email}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>{job.status}</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>{users[job.createdBy] || job.createdBy || "N/A"}</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>{formatDate(job.createdAt)}</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>{users[job.lastUpdatedBy] || job.lastUpdatedBy || "N/A"}</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif" }}>{formatDate(job.lastUpdatedAt)}</TableCell>
                <TableCell>
                  {job.status !== "cancelled" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancel(job)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}