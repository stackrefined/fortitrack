// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsz65sU-473VpN0f_eAg2JhOOjbmma3TM",
  authDomain: "hvac-dispatch-e3e2a.firebaseapp.com",
  projectId: "hvac-dispatch-e3e2a",
  storageBucket: "hvac-dispatch-e3e2a.appspot.com", // FIXED typo here!
  messagingSenderId: "505045684672",
  appId: "1:505045684672:web:G-34J0REDZZJ", // FIXED appId format
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
