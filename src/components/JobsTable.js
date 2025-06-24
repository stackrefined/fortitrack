import React, { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs, query, orderBy, limit, updateDoc, doc } from "firebase/firestore";
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
import TechnicianMap from "./TechnicianMap";

export default function JobsTable() {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [techs, setTechs] = useState([]);
  const [users, setUsers] = useState({});
  const { user } = useUser();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobsData = [];
      snapshot.forEach((doc) => jobsData.push({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // For each job, fetch the latest location (one marker per job)
    async function fetchLatestLocations() {
      let latestLocations = [];
      for (const job of jobs) {
        const locQuery = query(
          collection(db, "jobs", job.id, "locations"),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const locSnap = await getDocs(locQuery);
        locSnap.forEach((doc) => {
          const loc = doc.data();
          if (typeof loc.lat === "number" && typeof loc.lng === "number") {
            latestLocations.push({
              lat: loc.lat,
              lng: loc.lng,
              label: job.title ? job.title : `Job ${job.id.slice(-4)}`,
              jobId: job.id,
              timestamp: loc.timestamp,
            });
          }
        });
      }
      setLocations(latestLocations);
    }
    if (jobs.length) fetchLatestLocations();
  }, [jobs]);

  useEffect(() => {
    async function fetchUsers() {
      const usersSnap = await getDocs(collection(db, "users"));
      const usersMap = {};
      const techList = [];
      usersSnap.forEach((doc) => {
        const data = doc.data();
        usersMap[doc.id] = data.email || data.name || doc.id;
        if (data.role === "technician") {
          techList.push({ uid: doc.id, email: data.email });
        }
      });
      setUsers(usersMap);
      setTechs(techList);
    }
    fetchUsers();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.seconds) return new Date(date.seconds * 1000).toLocaleString();
    return new Date(date).toLocaleString();
  };

  const handleReassign = async (job, newTechUid) => {
    const oldTechUid = job.assignedTo;
    await updateDoc(doc(db, "jobs", job.id), {
      assignedTo: newTechUid,
      lastUpdatedAt: new Date(),
      lastUpdatedBy: user?.uid || "unknown",
    });
    await logJobChange(
      job.id,
      "reassignment",
      oldTechUid,
      newTechUid,
      user?.uid || "unknown"
    );
  };

  const handleCancel = async (job) => {
    await updateDoc(doc(db, "jobs", job.id), {
      status: "cancelled",
      lastUpdatedAt: new Date(),
      lastUpdatedBy: user?.uid || "unknown",
    });
    await logJobChange(
      job.id,
      "cancellation",
      job.status,
      "cancelled",
      user?.uid || "unknown"
    );
  };

  console.log("Locations passed to map:", JSON.stringify(locations, null, 2));

  return (
    <Paper sx={{ p: 2, mt: 2, maxWidth: 1100, margin: "0 auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Jobs Table
      </Typography>
      <div style={{ width: 340, height: 180, margin: "0 auto 24px auto", borderRadius: 12, overflow: "hidden", border: "1.5px solid #eaf1fb", boxShadow: "0 2px 12px #2563eb11" }}>
        <TechnicianMap locations={locations} height={180} width={340} />
      </div>
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