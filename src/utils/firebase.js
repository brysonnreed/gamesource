import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaKa1ACg_w6P6blW1NyQaSsk6luZ_ckBw",
  authDomain: "gamesource-ae2c0.firebaseapp.com",
  projectId: "gamesource-ae2c0",
  storageBucket: "gamesource-ae2c0.appspot.com",
  messagingSenderId: "656256051913",
  appId: "1:656256051913:web:9828a9175bc6d215527b18",
  measurementId: "G-KVVLJRHK9D",
};

initializeApp(firebaseConfig);

const DB = getFirestore();
const AUTH = getAuth();

export { DB, AUTH };
