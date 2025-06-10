import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function JobCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    // Fetch all users with role 'technician'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignedTo) return;
    await addDoc(collection(db, "jobs"), {
      title,
      description,
      assignedTo, // This is the UID
      status: "assigned",
      createdAt: new Date(),
    });
    setTitle("");
    setDescription("");
    setAssignedTo("");
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
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Assign to Technician"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {techs.map((tech) => (
            <MenuItem key={tech.uid} value={tech.uid}>
              {tech.email}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Create Job
        </Button>
      </form>
    </Paper>
  );
}