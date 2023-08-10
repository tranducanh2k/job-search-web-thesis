// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0tzDRoKl4fS7tA_sZOFgmw2fi4D0z8mk",
    authDomain: "thesis-5c8ab.firebaseapp.com",
    projectId: "thesis-5c8ab",
    storageBucket: "thesis-5c8ab.appspot.com",
    messagingSenderId: "959770489736",
    appId: "1:959770489736:web:da299635ed7974b06a403d",
    measurementId: "G-84FM4LXBEF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
