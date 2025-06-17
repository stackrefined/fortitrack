// filepath: src/components/DashboardContainer.jsx
import Paper from '@mui/material/Paper';
import { useNotification } from "../contexts/NotificationContext";

export default function DashboardContainer({ children }) {
  const { setSnack } = useNotification();

  const handleAction = () => {
    // Perform your action here

    // Show success notification
    setSnack({ open: true, message: "Action successful!", severity: "success" });
  };

  return (
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
      {children}
    </Paper>
  );
}