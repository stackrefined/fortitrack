import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { doc, updateDoc, serverTimestamp, addDoc, collection as fbCollection } from "firebase/firestore";
import { db } from "../firebase";
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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { logJobChange } from "../utils/jobChangeLogger";

const STATUS_OPTIONS = [
  { value: 'assigned', label: 'Assigned' },
  { value: 'enroute', label: 'Enroute' },
  { value: 'arrived', label: 'Arrived' },
  { value: 'job_started', label: 'Job Started' },
  { value: 'job_completed', label: 'Job Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function TechnicianJobs() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [updating, setUpdating] = useState({}); // Track which jobs are currently being updated (for button spinners)
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [fieldEdits, setFieldEdits] = useState({}); // Store unsaved edits for each job
  const [gpsWatchers, setGpsWatchers] = useState({}); // Keep track of which jobs we're watching GPS for

  useEffect(() => {
    if (!user) return;
    // Listen for jobs assigned to this tech, and update in real-time
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
    const job = jobs.find(j => j.id === jobId);
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: newStatus,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user?.uid || "unknown",
      });
      // Log the change so we always know who did what
      await logJobChange(
        jobId,
        "status",
        job.status,
        newStatus,
        user?.uid || "unknown"
      );
      setSnack({ open: true, message: 'Status updated!', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, message: 'Failed to update status.', severity: 'error' });
    }
    setUpdating((prev) => ({ ...prev, [jobId]: false }));
  };

  const handleAcceptJob = async (jobId) => {
    setUpdating((prev) => ({ ...prev, [jobId]: true }));
    try {
      await updateDoc(doc(db, "jobs", jobId), {
        confirmedAt: serverTimestamp(),
        confirmedBy: user?.uid || "unknown",
        status: "enroute",
        lastUpdatedAt: serverTimestamp(),
        lastUpdatedBy: user?.uid || "unknown",
      });
      setSnack({ open: true, message: 'Job accepted!', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, message: 'Failed to accept job.', severity: 'error' });
    }
    setUpdating((prev) => ({ ...prev, [jobId]: false }));
  };

  // When a tech edits a field (like start location or materials), stash the change locally until they hit "Save"
  const handleFieldEdit = (jobId, field, value) => {
    setFieldEdits((prev) => ({
      ...prev,
      [jobId]: { ...prev[jobId], [field]: value }
    }));
  };

  // Save all field edits for a job, and log each change for the audit trail
  const handleSaveFields = async (job) => {
    const edits = fieldEdits[job.id] || {};
    setUpdating((prev) => ({ ...prev, [job.id]: true }));
    try {
      await updateDoc(doc(db, 'jobs', job.id), {
        ...edits,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: user?.uid || "unknown",
      });
      // For every field the tech updated, make a note in the audit log.
      // This way, we always know who changed what (and when).
      for (const field of Object.keys(edits)) {
        await logJobChange(
          job.id,
          field,
          job[field] || "",
          edits[field],
          user?.uid || "unknown"
        );
      }
      setSnack({ open: true, message: 'Fields updated!', severity: 'success' });
      setFieldEdits((prev) => ({ ...prev, [job.id]: {} }));
    } catch (err) {
      setSnack({ open: true, message: 'Failed to update fields.', severity: 'error' });
    }
    setUpdating((prev) => ({ ...prev, [job.id]: false }));
  };

  // Format Firestore timestamps for display in the user's local timezone
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  // Should we be tracking GPS for this job? Only if the tech is on the way or working.
  const shouldTrackGps = (status) =>
    ["enroute", "arrived", "job_started"].includes(status);

  // Start watching the technician's location for this job.
  // We'll keep sending updates to Firestore until the job is finished.
  const startGpsTracking = (job) => {
    if (!navigator.geolocation || gpsWatchers[job.id]) return;
    const watcherId = navigator.geolocation.watchPosition(
      async (pos) => {
        // Got a new GPS position—let's save it to Firestore
        console.log("GPS position received", pos);
        try {
          await addDoc(
            fbCollection(db, "jobs", job.id, "locations"),
            {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: new Date(),
              userId: user?.uid || "unknown",
            }
          );
        } catch (err) {
          // If we can't write to Firestore, log it for debugging
          console.error("Failed to write GPS location:", err);
        }
      },
      (err) => {
        // If the browser can't get a GPS fix, let us know in the console
        console.error("GPS error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    setGpsWatchers((prev) => ({ ...prev, [job.id]: watcherId }));
  };

  // Done with this job? Let's stop tracking the tech's location to save battery.
  const stopGpsTracking = (jobId) => {
    if (gpsWatchers[jobId]) {
      navigator.geolocation.clearWatch(gpsWatchers[jobId]);
      setGpsWatchers((prev) => {
        const copy = { ...prev };
        delete copy[jobId];
        return copy;
      });
    }
  };

  // Whenever the job list changes, let's check if we should start or stop GPS tracking.
  // Only track if the tech is actually on the way or working.
  useEffect(() => {
    jobs.forEach((job) => {
      if (shouldTrackGps(job.status)) {
        startGpsTracking(job);
      } else {
        stopGpsTracking(job.id);
      }
    });
    // If the component unmounts, stop all GPS watchers so we don't leak memory or battery
    return () => {
      Object.values(gpsWatchers).forEach((watcherId) =>
        navigator.geolocation.clearWatch(watcherId)
      );
    };
    // eslint-disable-next-line
  }, [jobs]);

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        My Jobs
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Title", "Description", "Status", "Start Location", "Materials Needed", "Estimated Completion", "Closing Notes", "Last Updated", "Actions"].map(header => (
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
                <TableCell sx={{ fontWeight: 700 }}>{job.title}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{job.description}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
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
                    }}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <MenuItem
                        key={opt.value}
                        value={opt.value}
                        sx={{
                          fontWeight: 700,
                          fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                          color: "#174ea6"
                        }}
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    value={fieldEdits[job.id]?.startLocation ?? job.startLocation ?? ""}
                    onChange={e => handleFieldEdit(job.id, "startLocation", e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={fieldEdits[job.id]?.materialsNeeded ?? job.materialsNeeded ?? ""}
                    onChange={e => handleFieldEdit(job.id, "materialsNeeded", e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={fieldEdits[job.id]?.estimatedCompletion ?? job.estimatedCompletion ?? ""}
                    onChange={e => handleFieldEdit(job.id, "estimatedCompletion", e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={fieldEdits[job.id]?.closingNotes ?? job.closingNotes ?? ""}
                    onChange={e => handleFieldEdit(job.id, "closingNotes", e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {formatDate(job.lastUpdatedAt)}
                </TableCell>
                <TableCell>
                  {!job.confirmedAt ? (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleAcceptJob(job.id)}
                      disabled={updating[job.id]}
                    >
                      {updating[job.id] ? "Accepting..." : "Accept Job"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleSaveFields(job)}
                        disabled={updating[job.id]}
                        sx={{ mr: 1 }}
                      >
                        Save Fields
                      </Button>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>Accepted</span>
                    </>
                  )}
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

