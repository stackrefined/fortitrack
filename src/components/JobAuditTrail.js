import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function JobAuditTrail({ jobId }) {
  const [audit, setAudit] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "jobs", jobId, "audit"),
      (snap) => {
        const arr = [];
        snap.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
        setAudit(arr.sort((a, b) => b.changedAt?.seconds - a.changedAt?.seconds));
      }
    );
    return () => unsub();
  }, [jobId]);
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        Audit Trail
      </Typography>
      <List dense>
        {audit.map(entry => (
          <ListItem key={entry.id}>
            <ListItemText
              primary={`[${entry.type}] ${String(entry.oldValue)} → ${String(entry.newValue)}`}
              secondary={`By ${entry.changedBy} at ${entry.changedAt?.toDate().toLocaleString()}`}
            />
          </ListItem>
        ))}
        {audit.length === 0 && (
          <ListItem>
            <ListItemText primary="No audit entries yet." />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}