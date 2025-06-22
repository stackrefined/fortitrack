import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useUser } from "../contexts/UserContext";
import { useNotification } from "../contexts/NotificationContext";

export default function JobCreationForm() {
  // Local state for all the job fields and bulk import
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [techs, setTechs] = useState([]);
  const [bulkJson, setBulkJson] = useState("");
  const [bulkResult, setBulkResult] = useState(null);
  const { user } = useUser();
  const { setSnack } = useNotification();

  useEffect(() => {
    // Grab all users with the 'technician' role so we can assign jobs to them
    async function fetchTechs() {
      const usersSnap = await getDocs(collection(db, "users"));
      const techList = [];
      usersSnap.forEach((doc) => {
        const data = doc.data();
        if (data.role === "technician") {
          techList.push({ uid: doc.id, email: data.email });
        }
      });
      setTechs(techList);
    }
    fetchTechs();
  }, []);

  // When the dispatcher submits the form, create a new job in Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Oops! Make sure a tech is assigned before creating the job
    if (!assignedTo) return;
    await addDoc(collection(db, "jobs"), {
      title,
      description,
      assignedTo,
      status: "assigned",
      createdAt: serverTimestamp(),      // Always store UTC timestamp
      lastUpdatedAt: serverTimestamp(),  // Ditto for last update
      createdBy: user?.uid || "unknown",
      confirmedAt: null,
      confirmedBy: null,
      startLocation,
      materialsNeeded,
      estimatedCompletion,
      closingNotes: "",
    });
    // Reset the form so it's ready for the next job
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setStartLocation("");
    setMaterialsNeeded("");
    setEstimatedCompletion("");
    setSnack({ open: true, message: "Action successful!", severity: "success" });
  };

  // Handle bulk job import from pasted JSON.
  // This is a lifesaver for dispatchers who need to enter a bunch of jobs at once!
  const handleBulkImport = async () => {
    setBulkResult(null);
    let jobs;
    try {
      jobs = JSON.parse(bulkJson);
      if (!Array.isArray(jobs)) throw new Error("Input must be a JSON array.");
    } catch (err) {
      setBulkResult({ success: 0, failed: 0, errors: [`Invalid JSON: ${err.message}`] });
      return;
    }
    let success = 0, failed = 0, errors = [];
    for (const [i, job] of jobs.entries()) {
      try {
        await addDoc(collection(db, "jobs"), {
          title: job.title || "",
          description: job.description || "",
          assignedTo: job.assignedTo || "",
          status: job.status || "assigned",
          createdAt: serverTimestamp(),
          lastUpdatedAt: serverTimestamp(),
          createdBy: user?.uid || "unknown",
          confirmedAt: null,
          confirmedBy: null,
          startLocation: job.startLocation || "",
          materialsNeeded: job.materialsNeeded || "",
          estimatedCompletion: job.estimatedCompletion || "",
          closingNotes: job.closingNotes || "",
        });
        success++;
      } catch (err) {
        failed++;
        // If something goes wrong, let the dispatcher know which row failed
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }
    setBulkResult({ success, failed, errors });
    setBulkJson("");
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Job
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          sx={{
            mb: 2,
            fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
            fontWeight: 700,
            fontSize: { xs: '1.08rem', sm: '1.12rem' },
            color: '#174ea6',
            backgroundColor: '#f6faff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.08rem', sm: '1.12rem' },
              color: '#174ea6',
              backgroundColor: '#f6faff',
              borderRadius: 2,
              '& input': {
                color: '#174ea6',
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              },
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
          InputLabelProps={{
            style: {
              color: '#174ea6',
              background: '#fff',
              padding: '0 4px',
              borderRadius: '4px',
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: '1.08rem',
              letterSpacing: '0.01em',
            }
          }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          minRows={2}
          sx={{
            mb: 2,
            fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
            fontWeight: 700,
            fontSize: { xs: '1.08rem', sm: '1.12rem' },
            color: '#174ea6',
            backgroundColor: '#f6faff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.08rem', sm: '1.12rem' },
              color: '#174ea6',
              backgroundColor: '#f6faff',
              borderRadius: 2,
              '& input': {
                color: '#174ea6',
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              },
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
          InputLabelProps={{
            style: {
              color: '#174ea6',
              background: '#fff',
              padding: '0 4px',
              borderRadius: '4px',
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: '1.08rem',
              letterSpacing: '0.01em',
            }
          }}
        />
        <TextField
          select
          label="Assign to Technician"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          fullWidth
          required
          sx={{
            mb: 2,
            fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
            fontWeight: 700,
            fontSize: { xs: '1.08rem', sm: '1.12rem' },
            color: '#174ea6',
            backgroundColor: '#f6faff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.08rem', sm: '1.12rem' },
              color: '#174ea6',
              backgroundColor: '#f6faff',
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
          InputLabelProps={{
            style: {
              color: '#174ea6',
              background: '#fff',
              padding: '0 4px',
              borderRadius: '4px',
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              fontWeight: 700,
              fontSize: '1.08rem',
              letterSpacing: '0.01em',
            }
          }}
        >
          {techs.map((tech) => (
            <MenuItem
              key={tech.uid}
              value={tech.uid}
              sx={{
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                color: "#174ea6"
              }}
            >
              {tech.email}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Start Location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Materials Needed"
          value={materialsNeeded}
          onChange={(e) => setMaterialsNeeded(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Estimated Completion (e.g. 2 hours, 2025-06-22 14:00)"
          value={estimatedCompletion}
          onChange={(e) => setEstimatedCompletion(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Job
        </Button>
      </form>
      <Typography variant="subtitle1" sx={{ mt: 4, mb: 1, fontWeight: 700 }}>
        Bulk Import Jobs (Paste JSON Array)
      </Typography>
      <TextField
        label="Paste JSON Array Here"
        value={bulkJson}
        onChange={e => setBulkJson(e.target.value)}
        multiline
        minRows={4}
        fullWidth
        sx={{ mb: 2 }}
        placeholder={`[
  {
    "title": "Job 1",
    "description": "Fix AC",
    "assignedTo": "TECH_UID",
    "startLocation": "Warehouse",
    "materialsNeeded": "Filter",
    "estimatedCompletion": "2025-07-01 14:00"
  },
  ...
]`}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleBulkImport}
        sx={{ mb: 2 }}
      >
        Import Jobs from JSON
      </Button>
      {bulkResult && (
        <Paper sx={{ p: 2, mt: 1, background: "#f6faff" }}>
          <Typography variant="body2" color="success.main">
            Success: {bulkResult.success}
          </Typography>
          <Typography variant="body2" color="error.main">
            Failed: {bulkResult.failed}
          </Typography>
          {bulkResult.errors && bulkResult.errors.length > 0 && (
            <ul>
              {bulkResult.errors.map((err, idx) => (
                <li key={idx} style={{ color: "#b91c1c" }}>{err}</li>
              ))}
            </ul>
          )}
        </Paper>
      )}
    </Paper>
  );
}