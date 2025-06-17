import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useUser } from "../contexts/UserContext";
import { useNotification } from "../contexts/NotificationContext";

export default function JobCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [techs, setTechs] = useState([]);
  const { user } = useUser(); // Add this line
  const { setSnack } = useNotification();

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
      createdBy: user?.uid || "unknown", // Add this line
    });
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setSnack({ open: true, message: "Action successful!", severity: "success" });
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
        <Button type="submit" variant="contained" color="primary">
          Create Job
        </Button>
      </form>
    </Paper>
  );
}