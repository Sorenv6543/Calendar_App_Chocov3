import { ref, computed } from "vue";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "~/plugins/firebase";
import type { User } from "~/types/booking";

export function useAuth() {
  const user = ref<FirebaseUser | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  // Initialize auth state listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser;
    loading.value = false;
  });

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      user.value = userCredential.user;
      return userCredential.user;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    userData: Omit<User, "id" | "email">
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        ...userData,
      };

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), newUser);
      user.value = userCredential.user;
      return userCredential.user;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Sign out
  const logout = async () => {
    loading.value = true;
    error.value = null;
    try {
      await signOut(auth);
      user.value = null;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Get user data from Firestore
  const getUserData = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  const currentUser = computed(() => user.value);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    currentUser,
    signIn,
    signUp,
    logout,
    getUserData,
  };
}
