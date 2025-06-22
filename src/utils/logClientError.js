import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Logs a client-side error to Firestore.
 * @param {object} params
 * @param {string} params.error - Error message
 * @param {string} params.stack - Stack trace
 * @param {string} [params.userId] - User ID (optional)
 * @param {string} [params.context] - Where the error occurred (optional)
 */
export async function logClientError({ error, stack, userId, context }) {
  await addDoc(collection(db, "client_errors"), {
    error,
    stack,
    userId: userId || "unknown",
    context: context || "",
    timestamp: serverTimestamp(),
  });
}