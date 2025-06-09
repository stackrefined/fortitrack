// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCsz65sU-473VpN0f_eAg2JhOOjbmma3TM",
  authDomain: "hvac-dispatch-e3e2a.firebaseapp.com",
  projectId: "hvac-dispatch-e3e2a",
  storageBucket: "hvac-dispatch-e3e2a.appspot.com",
  messagingSenderId: "505045684672",
  appId: "1:505045684672:web:G-34J0REDZZJ",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optionally, export the app instance if needed elsewhere
export default app;