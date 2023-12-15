import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBy8-3VlDjvTwkOyMoqfEfwQG1kI5h1HeU",
    authDomain: "zaid-todo.firebaseapp.com",
    projectId: "zaid-todo",
    storageBucket: "zaid-todo.appspot.com",
    messagingSenderId: "300043236363",
    appId: "1:300043236363:web:246001eded1f5147fec30e",
    measurementId: "G-WN0QL3E22X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
