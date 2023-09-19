// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdXUVgyTjZZQFCaWGzbWZ_4pbctCiY24Y",
  authDomain: "taskflow-9a744.firebaseapp.com",
  projectId: "taskflow-9a744",
  storageBucket: "taskflow-9a744.appspot.com",
  messagingSenderId: "925663335373",
  appId: "1:925663335373:web:565c7006f75ee43fc0aa84",
  measurementId: "G-2MFLPY1KPC"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };