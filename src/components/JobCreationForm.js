import React, { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { collection, addDoc, Timestamp, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function JobCreationForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    date: "",
    technician: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    // Fetch all users with role "technician"
    const q = query(collection(db, "users"), where("role", "==", "technician"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const techs = [];
      snapshot.forEach((doc) => {
        techs.push({ id: doc.id, ...doc.data() });
      });
      setTechnicians(techs);
      console.log("Fetched technicians:", techs); // <-- Add this line
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        title: form.title,
        description: form.description,
        address: form.address,
        date: Timestamp.fromDate(new Date(form.date)),
        techId: form.technician,
        status: "pending",
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        address: "",
        date: "",
        technician: "",
      });
    } catch (error) {
      alert("Error creating job: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <TextField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Address"
        name="address"
        value={form.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Date/Time"
        name="date"
        type="datetime-local"
        value={form.date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        select
        label="Assign Technician"
        name="technician"
        value={form.technician}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {technicians.map((tech) => (
          <MenuItem key={tech.id} value={tech.id}>
            {tech.email || tech.id}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? "Creating..." : "Create Job"}
      </Button>
      {success && <Box color="green" mt={2}>Job created successfully!</Box>}
    </Box>
  );
}