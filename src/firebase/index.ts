import { initializeApp } from 'firebase/app';
// Import the services you need (e.g., Authentication, Firestore)
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// (Replace these values with the ones you copied from the Firebase Console in Phase 2)
const firebaseConfig = {
  apiKey: "AIzaSyCH71VRj6QVXHr2ElcqY8HPhw_fxQWoSng",
  authDomain: "dswd-gad-hub.firebaseapp.com",
  projectId: "dswd-gad-hub",
  storageBucket: "dswd-gad-hub.firebasestorage.app",
  messagingSenderId: "966436328421",
  appId: "1:966436328421:web:8b44c44f60e5e07c73d50c",
  measurementId: "G-RHSZ4P1Y1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them for use in your components
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});