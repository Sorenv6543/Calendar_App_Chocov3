import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

// Register a new user
export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Log in an existing user
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Get the current authenticated user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen for authentication state changes
export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// Log out the current user
export const logoutUser = () => {
  return signOut(auth);
};

// Export the auth instance
export { auth };
