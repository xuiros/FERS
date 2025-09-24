// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVsYwSE1RxUp2m4rOd5g7y4nH7CRvY_nE",
  authDomain: "adminwebsitefers.firebaseapp.com",
  projectId: "adminwebsitefers",
  storageBucket: "adminwebsitefers.firebasestorage.app",
  messagingSenderId: "632787440723",
  appId: "1:632787440723:web:0e1883e395023013a1a2a6",
  measurementId: "G-8SNDDGYYYT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
