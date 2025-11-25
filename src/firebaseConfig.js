import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSZgFYmMZ1TTsEfvGxeQ4ng1rAIBLRNiE",
    authDomain: "ecoroute-d50c2.firebaseapp.com",
    projectId: "ecoroute-d50c2",
    storageBucket: "ecoroute-d50c2.firebasestorage.app",
    messagingSenderId: "131890583404",
    appId: "1:131890583404:web:40eb7ec23770f24018c549",
    measurementId: "G-GS3NXP2VYX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
