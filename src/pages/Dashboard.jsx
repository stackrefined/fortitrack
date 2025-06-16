import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import {
  Box,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { useUser } from "../contexts/UserContext";
import JobCreationForm from "../components/JobCreationForm";
import JobsTable from "../components/JobsTable";
import TechnicianJobs from "../components/TechnicianJobs";
import AdminUsersTab from "../components/AdminUsersTab"; // If you have this
import "../App.css"; // Ensure this imports .fortitrack-background and .login-logo

export default function Dashboard() {
  const { role, loading: userLoading } = useUser();
  const [tab, setTab] = useState(0);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  if (userLoading) {
    return (
      <Box className="fortitrack-background" sx={{ minHeight: "100vh" }}>
        <CircularProgress sx={{ mt: 8 }} />
      </Box>
    );
  }

  // Define which tabs are visible for each role
  const tabs = [];
  if (role === "admin") {
    tabs.push({
      label: "Users",
      component: <AdminUsersTab />, // Swap in your real user management tab
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
    <Box className="fortitrack-background">
      <div className="stackrefined-banner">
        A <span className="brand">Stackrefined</span> Solution
      </div>
      <img src="/logo.png" alt="FortiTrack Logo" className="login-logo" />
      <Paper
        elevation={8}
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 900,
          width: "100%",
          borderRadius: 3,
          backgroundColor: "#fff",
          color: "#174ea6",
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#174ea6" }}
          >
            FortiTrack Dashboard
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 2,
            "& .MuiTab-root": { fontWeight: 700, color: "#174ea6" },
            "& .Mui-selected": { color: "#2563eb" },
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>{tabs[tab]?.component}</Box>
      </Paper>
    </Box>
  );
}