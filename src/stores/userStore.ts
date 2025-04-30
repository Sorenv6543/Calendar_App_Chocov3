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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define interface for userData
interface UserData {
  id: string;
  email: string;
  fullName: string;
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

  /**
   * CENTRALIZED STATE MANAGEMENT
   *
   * The store serves as the single source of truth for:
   * 1. Application data (userInfo, houses, events)
   * 2. Data persistence operations (CRUD with Firestore)
   * 3. State that needs to be shared across components
   *
   * Components interact with the store instead of directly with Firestore,
   * creating a clean separation of concerns:
   * - Components: Handle UI and user interactions
   * - Store: Manages data, business logic, and persistence
   */
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
        this.unsubscribeUser = await fetchUserData(currentUser, this);
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

    /**
     * HOUSE MANAGEMENT
     *
     * These methods handle all house-related operations:
     * 1. Update Firestore (persistence layer)
     * 2. Immediately update local state for responsive UI
     * 3. Return consistent data to components
     *
     * This allows components to be "dumb" UI layers that emit events
     * while the store handles all data logic.
     */
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
        };

        // Only add contactnumber if it's defined (not undefined or null)
        if (newHouse.contactnumber) {
          newHouseData.contactnumber = newHouse.contactnumber;
        }

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

    /**
     * EVENT MANAGEMENT
     *
     * These methods handle all event-related operations:
     * 1. Manage CRUD operations with Firestore
     * 2. Ensure consistent error handling
     * 3. Create a clean API for components to use
     *
     * By centralizing these operations, components don't need
     * to know the details of how data is stored or retrieved.
     */
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

    async updateEvent(eventData: Partial<Event>) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");
        if (!eventData.id) throw new Error("Event ID is required for updates.");

        // Create a copy of the event data without the id field
        const { id, ...updateData } = eventData;

        // Update the event in Firestore
        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, updateData);

        return true;
      } catch (err: any) {
        console.error("Failed to update event:", err);
        this.error = "Failed to update event.";
        throw err;
      }
    },

    async deleteEvent(eventId: string) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");
        if (!eventId) throw new Error("Event ID is required for deletion.");

        // Delete the event from Firestore
        const eventRef = doc(db, "events", eventId);
        await deleteDoc(eventRef);

        return true;
      } catch (err: any) {
        console.error("Failed to delete event:", err);
        this.error = "Failed to delete event.";
        throw err;
      }
    },

    async logout() {
      try {
        if (this.unsubscribeUser) {
          this.unsubscribeUser();
          this.unsubscribeUser = null;
        }
        
        await logoutUser();
        this.userData = null;
        this.selectedHouse = null;
        this.selectedHouseId = null;
      } catch (err: any) {
        this.error = "Failed to log out: " + err.message;
      }
    },
  },
});
