import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeCA_wut1H1_RyOKLfcLXSj-GCb8GOxkY",
  authDomain: "sonalis-handcrafts.firebaseapp.com",
  projectId: "sonalis-handcrafts",
  storageBucket: "sonalis-handcrafts.firebasestorage.app",
  messagingSenderId: "275433297737",
  appId: "1:275433297737:web:be6eee5d452c77245dec98",
  measurementId: "G-4FE43YQE09"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
