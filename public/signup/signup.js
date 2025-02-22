// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQ9cWKjfFAzBCOaD6weEI4SoHHnk3ULcY",
    authDomain: "cinexa-plus.firebaseapp.com",
    projectId: "cinexa-plus",
    storageBucket: "cinexa-plus.firebasestorage.app",
    messagingSenderId: "568363600441",
    appId: "1:568363600441:web:34396e502d5844a7865be8",
    measurementId: "G-E9T72TN34C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Select Elements
const signupForm = document.getElementById("signup-form");
const errorMessage = document.getElementById("error-message");

// Ensure the script runs only when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent form reload

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Validate passwords match
        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match!";
            return;
        }

        try {
            // Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                activeSubscription: false // New users don't have a subscription yet
            });

            // Redirect to Plans Page after signup
            window.location.href = "/plans.html"; 
        } catch (error) {
            errorMessage.textContent = error.message;
            console.error("Signup Error:", error.message);
        }
    });
});
