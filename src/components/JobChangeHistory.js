import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function JobChangeHistory({ jobId }) {
  const [changes, setChanges] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "jobs", jobId, "changes"),
      (snap) => {
        const arr = [];
        snap.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
        setChanges(arr.sort((a, b) => b.changedAt?.seconds - a.changedAt?.seconds));
      }
    );
    return () => unsub();
  }, [jobId]);
  return (
    <div>
      <h4>Change History</h4>
      <ul>
        {changes.map(change => (
          <li key={change.id}>
            [{change.type}] {String(change.oldValue)} → {String(change.newValue)} by {change.changedBy} at {change.changedAt?.toDate().toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}