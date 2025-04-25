import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASix7bN7sWujniG5gLUFyUXy3JCt4lMYs",
  authDomain: "empmanager-846a6.firebaseapp.com",
  projectId: "empmanager-846a6",
  storageBucket: "empmanager-846a6.appspot.com",
  messagingSenderId: "901845253879",
  appId: "1:901845253879:web:6daf30c41dc0e2f4b5ddf2",
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
}

export { app, auth, db, analytics };
