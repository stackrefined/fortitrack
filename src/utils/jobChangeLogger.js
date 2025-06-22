import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Logs a change to a job's changes subcollection and audit subcollection.
 * @param {string} jobId - The job's document ID.
 * @param {string} type - The type of change (e.g., "status", "reassignment", "cancellation").
 * @param {any} oldValue - The previous value.
 * @param {any} newValue - The new value.
 * @param {string} changedBy - The user ID who made the change.
 */
export async function logJobChange(jobId, type, oldValue, newValue, changedBy) {
  const logEntry = {
    type,
    oldValue,
    newValue,
    changedBy,
    changedAt: serverTimestamp(),
  };
  await addDoc(collection(db, "jobs", jobId, "changes"), logEntry);
  await addDoc(collection(db, "jobs", jobId, "audit"), logEntry);
}