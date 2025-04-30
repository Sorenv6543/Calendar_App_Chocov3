import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { auth } from "./auth";
import { House } from "./stores/houseStore";
import { useHouseStore } from "./stores/houseStore";

// Define interfaces
interface UserData {
  id: string;
  email: string;
  fullName: string;
}

interface StoreState {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
}

// Function to fetch user data
export const fetchUserData = (currentUser: any, state: StoreState) => {
  const userDocRef = doc(db, "users", currentUser.uid);
  const houseStore = useHouseStore();

  // Listen to real-time updates in Firestore for the user's document
  const unsubscribeUser = onSnapshot(
    userDocRef,
    (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        
        // Update user data in userStore
        state.userData = {
          id: currentUser.uid,
          email: userData?.email || currentUser.email || "",
          fullName: userData?.fullName || "",
        };
        
        // Update houses in houseStore
        if (Array.isArray(userData?.houses)) {
          houseStore.setHouses(userData.houses as House[]);
        } else {
          houseStore.setHouses([]);
        }
      } else {
        // Create empty userData structure to prevent null references
        state.userData = {
          id: currentUser.uid,
          email: currentUser.email || "",
          fullName: "",
        };
        houseStore.setHouses([]);
        state.error = "User document does not exist";
      }
      state.isLoading = false;
    },
    (err) => {
      console.error("Error fetching user data: ", err);
      state.error = "Failed to load user data. Please try again.";
      state.isLoading = false;

      // Ensure userData is at least initialized with empty values on error
      if (!state.userData) {
        state.userData = {
          id: currentUser.uid,
          email: currentUser.email || "",
          fullName: "",
        };
      }
      houseStore.setHouses([]);
    }
  );

  return unsubscribeUser; // Return the unsubscribe function for cleanup
};

// Function to delete a house
