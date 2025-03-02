import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Import Firebase Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyB4HFkP6660mle4QKARWPtoQr8YDHs1j1w",
  authDomain: "clone-react-c53c1.firebaseapp.com",
  projectId: "clone-react-c53c1",
  storageBucket: "clone-react-c53c1.firebasestorage.app",
  messagingSenderId: "981588535802",
  appId: "1:981588535802:web:eae11692c97e0fabfc9c43",
  measurementId: "G-QQGB9JGZDD"
};

const firebaseApp = initializeApp(firebaseConfig);

// Export Firebase services for use in your app
export const auth = getAuth(firebaseApp); // Firebase Authentication
export const storage = getStorage(firebaseApp); // Firebase Storage
export const db = getFirestore(firebaseApp); // Firestore
export const database = getDatabase(firebaseApp); // Firebase Realtime Database

export { firebaseApp }; // Export firebaseApp

export default firebaseApp;
