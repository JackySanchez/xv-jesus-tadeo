// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBs8qgdsleFQJkGZeXT3gZ2IE7AMzniN7w",
  authDomain: "xv-jesus-tadeo.firebaseapp.com",
  projectId: "xv-jesus-tadeo",
  storageBucket: "xv-jesus-tadeo.firebasestorage.app",
  messagingSenderId: "464150999270",
  appId: "1:464150999270:web:00bd3ccaf3576241b08b27",
  measurementId: "G-LX9L1SDYHS"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.query = query;
window.orderBy = orderBy;