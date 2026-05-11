// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpgmIpooAtWh6yfeZqjDHspWmleZEsHAI",
    authDomain: "antigra-d522e.firebaseapp.com",
    projectId: "antigra-d522e",
    storageBucket: "antigra-d522e.firebasestorage.app",
    messagingSenderId: "187294809714",
    appId: "1:187294809714:web:515728a5841ce650638ceb",
    measurementId: "G-4SB0XFN044"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (err) {
    console.warn("Analytics failed to initialize:", err);
}

export { db, analytics };
