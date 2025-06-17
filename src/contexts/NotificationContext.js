// filepath: src/contexts/NotificationContext.js
import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  return (
    <NotificationContext.Provider value={{ snack, setSnack }}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.message}
      />
    </NotificationContext.Provider>
  );
}