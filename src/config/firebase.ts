// firebase.ts
import { initializeApp } from "firebase/app";

// Si tu n’utilises pas encore Firestore ou Auth :
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDeor7RtA6uXdlKyPaK7ViV4sFUqX5pDa4",
  authDomain: "apple-services.firebaseapp.com",
  projectId: "apple-services",
  storageBucket: "apple-services.appspot.com", // <-- petite correction ici
  messagingSenderId: "937591542961",
  appId: "1:937591542961:web:bed7d25e535a02d2a37e90",
  measurementId: "G-6WERLS37W9"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Exporte les instances
export const auth = getAuth(app);
export const db = getFirestore(app);
