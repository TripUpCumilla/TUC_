import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_qgj5IEeK7n3soI0o6EKuOwdyCpTA14s",
  authDomain: "trip-d13c6.firebaseapp.com",
  projectId: "trip-d13c6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_qgj5IEeK7n3soI0o6EKuOwdyCpTA14s",
  authDomain: "trip-d13c6.firebaseapp.com",
  projectId: "trip-d13c6",
  storageBucket: "trip-d13c6.firebasestorage.app",
  messagingSenderId: "245889992500",
  appId: "1:245889992500:web:931fb5ad7976cfa9898761",
  measurementId: "G-S3MQ2RFTV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
