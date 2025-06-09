import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
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
} from "@mui/material";

const ROLES = ["admin", "dispatcher", "technician"];

export default function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, mt: 2, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>UID</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email || "N/A"}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}