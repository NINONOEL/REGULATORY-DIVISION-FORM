import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlrJ2Z2z9ZB8tAYDxNRduvlroIv9oItik",
  authDomain: "regdivform.firebaseapp.com",
  projectId: "regdivform",
  storageBucket: "regdivform.firebasestorage.app",
  messagingSenderId: "164231734997",
  appId: "1:164231734997:web:f867fbe078e64f6612245c",
  measurementId: "G-KC8JVD1MYJ"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
