import { defineStore } from "pinia";
import { auth, onAuthStateChangedListener, logoutUser } from "../auth";
import { fetchUserData } from "../user-utils";
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
export const useUserStore = defineStore("user", {
  state: () => ({
    userData: null,
    isLoading: true,
    error: null,
    houses: [],
    selectedHouse: null,
    selectedHouseId: null,
    unsubscribeUser: null,
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
          this.houses = [];
        } else if (this.userData && Array.isArray(this.userData.houses)) {
          // Make a deep copy to ensure reactivity
          this.houses = JSON.parse(JSON.stringify(this.userData.houses));
          
          // Sort houses by address for consistent display
          this.houses.sort((a, b) => {
            if (a.address && b.address) {
              return a.address.localeCompare(b.address);
            }
            return 0;
          });
        } else {
          this.houses = [];
          
        }
      } catch (err) {
        this.error = "Failed to load user data: " + err.message;
      
        this.houses = [];
      } finally {
        this.isLoading = false;
      }
    },
    selectHouse(house) {
      this.selectedHouse = house;
      this.selectedHouseId = house ? house.houseId : null;
    },
    generateHouseId(length) {
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
    async createHouse(newHouse) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");
        
        // Create a new house object with all required fields
        const newHouseData = {
          userId: this.userData.id,
          houseId: this.generateHouseId(10),
          address: newHouse.address,
          color: newHouse.color || "#66b8ca",
          contactnumber: contactnumber || "",
          selected: true
        };
        

        // Update Firestore
        const userDocRef = doc(db, "users", this.userData.id);
        await updateDoc(userDocRef, { houses: arrayUnion(newHouseData) });
        
        // Immediately update local state
        if (!Array.isArray(this.userData.houses)) {
          this.userData.houses = [];
        }
        
        // Add to both houses arrays for immediate reactivity
        this.userData.houses.push(newHouseData);
        this.houses.push(newHouseData);
        
        return newHouseData;
      } catch (err) {
        console.error("Failed to add house:", err);
        this.error = "Failed to add house.";
        throw err;
      }
    },
    async deleteHouse(house) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");
        
        
        // Find the exact house to delete by houseId
        const houseToDelete = this.userData.houses.find(h => h.houseId === house.houseId);
        
        if (!houseToDelete) {
          console.error("House not found for deletion:", house.houseId);
          throw new Error("House not found");
        }
        
        const userDocRef = doc(db, "users", this.userData.id);
        await updateDoc(userDocRef, { houses: arrayRemove(houseToDelete) });
        
        // Immediately update the local state
        this.userData.houses = this.userData.houses.filter(h => h.houseId !== house.houseId);
        this.houses = this.houses.filter(h => h.houseId !== house.houseId);
        
        
        return true;
      } catch (err) {
        console.error("Failed to delete house:", err);
        this.error = "Failed to delete house.";
        throw err;
      }
    },
    async createEvent(eventData) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");
        
        // Ensure userId is set
        eventData.userId = this.userData.id;
        
        // Add to events collection
        const docRef = await addDoc(collection(db, "events"), eventData);
        
        // Return the created event with ID
        return {
          id: docRef.id,
          ...eventData
        };
      } catch (err) {
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
        this.houses = [];
        this.selectedHouse = null;
        this.selectedHouseId = null;
        this.error = null;
      } catch (err) {
        this.error = "Failed to logout.";
      }
    },
  },
});
