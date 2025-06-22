import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useUser } from "../contexts/UserContext";
import JobCreationForm from "../components/JobCreationForm";
import JobsTable from "../components/JobsTable";
import TechnicianJobs from "../components/TechnicianJobs";
import AdminUsersTab from "../components/AdminUsersTab";
import DiagnosticsDashboard from "../components/DiagnosticsDashboard";
import "../App.css";

export default function Dashboard() {
  const { role, loading: userLoading, user } = useUser();
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  if (userLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #f6faff 0%, #eaf1fb 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ mt: 8 }} />
      </Box>
    );
  }

  // Define tabs per role
  const tabs = [];
  if (role === "admin") {
    tabs.push({ label: "Users", component: <AdminUsersTab /> });
    tabs.push({
      label: "Jobs",
      component: (
        <>
          <JobCreationForm />
          <JobsTable />
        </>
      ),
    });
    tabs.push({
      label: "Diagnostics",
      component: <DiagnosticsDashboard />,
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
    tabs.push({
      label: "Diagnostics",
      component: <DiagnosticsDashboard />,
    });
  }
  if (role === "technician") {
    tabs.push({ label: "My Jobs", component: <TechnicianJobs /> });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f6faff 0%, #eaf1fb 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: { xs: 2, md: 6 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 980,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          px: { xs: 2, md: 0 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src="/logo.png"
            alt="FortiTrack Logo"
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              boxShadow: "0 2px 12px #2563eb22",
              background: "#fff",
              padding: 6,
            }}
          />
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              color: "#174ea6",
              letterSpacing: "0.08em",
              fontFamily: "'Montserrat', 'Inter', sans-serif",
            }}
          >
            FortiTrack
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <Avatar
              sx={{
                bgcolor: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                width: 40,
                height: 40,
                fontSize: "1.1rem",
              }}
            >
              {user.email ? user.email[0].toUpperCase() : "U"}
            </Avatar>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            sx={{
              borderRadius: "999px",
              px: 3,
              fontWeight: 700,
              borderColor: "#2563eb",
              color: "#2563eb",
              "&:hover": {
                background: "#2563eb",
                color: "#fff",
                borderColor: "#2563eb",
              },
              transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          background: "linear-gradient(135deg, #eaf6fbcc 0%, #e6f0facc 100%)", // Unique light blue gradient
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(23,78,166,0.10)",
          border: "1.5px solid #d0e6f7",
          p: { xs: 2, sm: 4 },
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backdropFilter: "blur(6px)",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            mb: 2,
            "& .MuiTabs-indicator": {
              background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              height: 4,
              borderRadius: 2,
            },
            "& .MuiTab-root": {
              fontWeight: 700,
              color: "#174ea6",
              borderRadius: "999px",
              px: 3,
              mx: 0.5,
              minHeight: 44,
              transition: "background 0.18s",
            },
            "& .Mui-selected": {
              background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              color: "#fff !important",
            },
          }}
        >
          {tabs.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>{tabs[tab]?.component}</Box>
      </Box>
      <Box sx={{ color: "#2563eb", opacity: 0.7, fontWeight: 700, fontSize: "1.1rem", mt: 2 }}>
        A <span style={{ color: "#60a5fa", fontWeight: 900 }}>Stackrefined</span> Solution
      </Box>
    </Box>
  );
}