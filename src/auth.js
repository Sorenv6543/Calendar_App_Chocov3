// src/auth.js

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from './firebaseConfig.js';

const auth = getAuth(app);

// Register a new user
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Log in an existing user
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Get the current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser?.uid || null;
};

// Listen for authentication state changes
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Log out the current user
export const logoutUser = () => {
  return signOut(auth);
};

// Export the auth instance
export { auth };