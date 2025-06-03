import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBOuDZDVRgcgsqk0lxYeAcYWWQC3d2MZqg",
    authDomain: "raterat-3f487.firebaseapp.com",
    projectId: "raterat-3f487",
    storageBucket: "raterat-3f487.firebasestorage.app",
    messagingSenderId: "557375630548",
    appId: "1:557375630548:web:bef324129018ed33d55f41",
    measurementId: "G-Q3J642EW7B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
