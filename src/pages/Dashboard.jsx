import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { useUser } from "../contexts/UserContext";
import JobCreationForm from "../components/JobCreationForm";
import JobsTable from "../components/JobsTable";
import TechnicianJobs from "../components/TechnicianJobs"; // Add this import

export default function Dashboard() {
  const { role, loading: userLoading } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    // Set up real-time listener for jobs collection
    const unsubscribe = onSnapshot(collection(db, "jobs"), (querySnapshot) => {
      const jobsData = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobsData);
      setLoading(false);
    });
    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  if (userLoading) {
    return <Typography>Loading...</Typography>;
  }

  // Define which tabs are visible for each role
  const tabs = [];
  if (role === "admin") {
    tabs.push({
      label: "Users",
      component: <div>Users management coming soon</div>,
    });
    tabs.push({
      label: "Jobs",
      component: (
        <>
          <JobCreationForm />
          <JobsTable />
        </>
      ),
    });
  }
  if (role === "dispatcher") {
    tabs.push({
      label: "Jobs",
      component: (
        <>
          <JobCreationForm />
          <JobsTable />
        </>
      ),
    });
  }
  if (role === "technician") {
    tabs.push({
      label: "My Jobs",
      component: <TechnicianJobs />,
    });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 4,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 900,
          width: "100%",
          borderRadius: 4,
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            FortiTrack Dashboard
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          {tabs.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>{tabs[tab]?.component}</Box>
      </Paper>
    </Box>
  );
}