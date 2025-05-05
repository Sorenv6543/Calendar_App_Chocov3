import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { auth } from "./auth";
import { User } from "firebase/auth";
import { House } from "./stores/houseStore";
import { useHouseStore } from "./stores/houseStore";

// Define interfaces
interface UserData {
  id: string;
  email: string;
  fullName: string;
  houses: House[];
}

interface House {
  userId: string;
  houseId: string;
  address: string;
  color: string;
  selected?: boolean;
  contactnumber?: string;
}

interface UserStore {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  houses?: House[];
}

// Function to fetch user data
export const fetchUserData = (
  currentUser: User,
  state: UserStore
): (() => void) => {
  const userDocRef = doc(db, "users", currentUser.uid);
  const houseStore = useHouseStore();

  // Initialize houses array immediately to prevent errors while data is loading
  if (!state.houses || !Array.isArray(state.houses)) {
    state.houses = [];
  }

  // Listen to real-time updates in Firestore for the user's document
  const unsubscribeUser = onSnapshot(
    userDocRef,
    (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        state.userData = {
          id: auth.currentUser?.uid || "",
          email: userData?.email || currentUser.email || "",
          fullName: userData?.fullName || "",
          houses: Array.isArray(userData?.houses) ? userData.houses : [],
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
          id: auth.currentUser?.uid || "",
          email: currentUser.email || "",
          fullName: "",
          houses: [],
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
          id: auth.currentUser?.uid || "",
          email: currentUser.email || "",
          fullName: "",
          houses: [],
        };
      }
      houseStore.setHouses([]);
    }
  );

  return unsubscribeUser; // Return the unsubscribe function to allow cleanup in Home.vue
};

// Function to delete a house
