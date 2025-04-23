// src/firebaseConfig.js
// @ts-ignore
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyASix7bN7sWujniG5gLUFyUXy3JCt4lMYs",
    authDomain: "empmanager-846a6.firebaseapp.com",
    projectId: "empmanager-846a6",
    storageBucket: "empmanager-846a6.appspot.com",
    messagingSenderId: "901845253879",
    appId: "1:901845253879:web:6daf30c41dc0e2f4b5ddf2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the app and db instances
export { app, db};