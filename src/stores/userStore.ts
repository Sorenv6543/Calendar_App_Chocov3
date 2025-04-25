import { defineStore } from "pinia";
import { auth, onAuthStateChangedListener, logoutUser } from "../auth";
import { fetchUserData } from "../user-utils";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define interface for userData
interface UserData {
  id: string;
  email: string;
  fullName: string;
  houses: House[];
}

// Define interface for House
interface House {
  userId: string;
  houseId: string;
  address: string;
  color: string;
  selected?: boolean;
  contactnumber?: string;
}

// Define interface for Event
interface Event {
  userId: string;
  title: string;
  start: string;
  end: string;
  houseId?: string;
  description?: string;
  [key: string]: any;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    userData: null as UserData | null,
    isLoading: true,
    error: null as string | null,
    selectedHouse: null as House | null,
    selectedHouseId: null as string | null,
    unsubscribeUser: null as Function | null,
  }),

  actions: {
    async initAuthListener() {
      this.isLoading = true;
      onAuthStateChangedListener(async (currentUser) => {
        if (currentUser) {
          await this.fetchUserData(currentUser);
        } else {
          this.userData = null;
        }
        this.isLoading = false;
      });
    },

    async fetchUserData(currentUser) {
      this.isLoading = true;
      this.error = null;
      try {
        const unsubscribe = await fetchUserData(currentUser, this);
        this.unsubscribeUser = unsubscribe;

        if (this.userData === null) {
          // We don't need to set this.houses as it's not used for rendering
        } else if (this.userData && Array.isArray(this.userData.houses)) {
          // Sort houses by address for consistent display
          this.userData.houses.sort((a, b) => {
            if (a.address && b.address) {
              return a.address.localeCompare(b.address);
            }
            return 0;
          });
        }
      } catch (err: any) {
        this.error = "Failed to load user data: " + err.message;
      } finally {
        this.isLoading = false;
      }
    },

    selectHouse(house: House) {
      this.selectedHouse = house;
      this.selectedHouseId = house ? house.houseId : null;
    },

    generateHouseId(length: number): string {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },

    async createHouse(newHouse: Partial<House>) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");

        // Create a new house object with all required fields
        const newHouseData: House = {
          userId: this.userData.id,
          houseId: this.generateHouseId(10),
          address: newHouse.address || "",
          color: newHouse.color || "#66b8ca",
          selected: true,
          contactnumber: newHouse.contactnumber,
        };

        // Update Firestore
        const userDocRef = doc(db, "users", this.userData.id);
        await updateDoc(userDocRef, { houses: arrayUnion(newHouseData) });

        // Immediately update local state
        if (!Array.isArray(this.userData.houses)) {
          this.userData.houses = [];
        }

        // Add to userData.houses only - don't duplicate in this.houses
        this.userData.houses.push(newHouseData);

        return newHouseData;
      } catch (err: any) {
        console.error("Failed to add house:", err);
        this.error = "Failed to add house.";
        throw err;
      }
    },

    async deleteHouse(house: House) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");

        // Find the exact house to delete by houseId
        const houseToDelete = this.userData.houses.find(
          (h) => h.houseId === house.houseId
        );

        if (!houseToDelete) {
          console.error("House not found for deletion:", house.houseId);
          throw new Error("House not found");
        }

        const userDocRef = doc(db, "users", this.userData.id);
        await updateDoc(userDocRef, { houses: arrayRemove(houseToDelete) });

        // Immediately update just the userData.houses array
        this.userData.houses = this.userData.houses.filter(
          (h) => h.houseId !== house.houseId
        );

        return true;
      } catch (err: any) {
        console.error("Failed to delete house:", err);
        this.error = "Failed to delete house.";
        throw err;
      }
    },

    async createEvent(eventData: Partial<Event>) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");

        // Ensure userId is set
        eventData.userId = this.userData.id;

        // Add to events collection
        const docRef = await addDoc(collection(db, "events"), eventData);

        // Return the created event with ID
        return {
          id: docRef.id,
          ...eventData,
        };
      } catch (err: any) {
        console.error("Failed to create event:", err);
        this.error = "Failed to create event.";
        throw err;
      }
    },

    async logout() {
      try {
        if (this.unsubscribeUser) this.unsubscribeUser();
        await logoutUser();
        this.userData = null;
        this.selectedHouse = null;
        this.selectedHouseId = null;
        this.error = null;
      } catch (err) {
        this.error = "Failed to logout.";
      }
    },
  },
});
