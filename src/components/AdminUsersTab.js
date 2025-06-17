import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNotification } from "../contexts/NotificationContext";

const ROLES = ["admin", "dispatcher", "technician"];

export default function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "technician" });
  const [adding, setAdding] = useState(false);
  const { setSnack } = useNotification();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    setSnack({ open: true, message: "Action successful!", severity: "success" });
  };

  const handleDeactivate = async (userId) => {
    await updateDoc(doc(db, "users", userId), { status: "inactive" });
    setSnack({ open: true, message: "Action successful!", severity: "success" });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    // NOTE: This only adds to Firestore, not Firebase Auth!
    await addDoc(collection(db, "users"), {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: "active",
    });
    setNewUser({ email: "", name: "", role: "technician" });
    setAdding(false);
    setSnack({ open: true, message: "Action successful!", severity: "success" });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, mt: 2, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleAddUser} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <TextField
            label="Email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            required
            size="small"
            sx={{
              fontWeight: 700,
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              color: "#174ea6",
              backgroundColor: '#f6faff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                color: "#174ea6",
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
          />
          <TextField
            label="Name"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            required
            size="small"
            sx={{
              fontWeight: 700,
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              color: "#174ea6",
              backgroundColor: '#f6faff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                color: "#174ea6",
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
          <Select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            size="small"
            sx={{
              fontWeight: 700,
              fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
              color: "#174ea6",
              backgroundColor: '#f6faff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif",
                color: "#174ea6",
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
          >
            {ROLES.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Select>
          <Button type="submit" variant="contained" disabled={adding}>
            {adding ? "Adding..." : "Add User"}
          </Button>
        </form>
      </Paper>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>UID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ fontWeight: 700, fontFamily: "'Montserrat', 'Inter', 'Poppins', Arial, sans-serif", color: "#174ea6" }}>{user.email || "N/A"}</TableCell>
                <TableCell>{user.name || "N/A"}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    size="small"
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{user.status || "active"}</TableCell>
                <TableCell>
                  {user.status !== "inactive" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeactivate(user.id)}
                    >
                      Deactivate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}