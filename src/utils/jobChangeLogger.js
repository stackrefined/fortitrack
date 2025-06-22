import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Whenever something important changes on a job (like status, reassignment, or cancellation),
 * let's make a note in both the 'changes' and 'audit' logs for that job.
 * This way, we always have a clear record of who did what, and when.
 *
 * @param {string} jobId - The job's document ID.
 * @param {string} type - What kind of change happened (e.g., "status", "reassignment", "cancellation").
 * @param {any} oldValue - What the value was before the change.
 * @param {any} newValue - What the value is now.
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
  // Write to both 'changes' and 'audit' subcollections so we can always trace the job's history
  await addDoc(collection(db, "jobs", jobId, "changes"), logEntry);
  await addDoc(collection(db, "jobs", jobId, "audit"), logEntry);
}