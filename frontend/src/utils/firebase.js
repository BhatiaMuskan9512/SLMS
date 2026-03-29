// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/**
 * Firebase Configuration
 * Replace the process.env values with your actual keys from Firebase Console
 * if you are not using an .env file yet.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize Firebase Authentication
export const auth = getAuth(app);

// 3. Setup Google Auth Provider
// This is the instance we call when the user clicks "Login with Google"
export const googleProvider = new GoogleAuthProvider();

// Setting custom parameters (optional: forces account selection)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;