import { defineStore } from "pinia";
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useUserStore } from "./userStore";

// Define interface for House
export interface House {
  userId: string;
  houseId: string;
  address: string;
  color: string;
  selected?: boolean;
  contactnumber?: string;
}

export const useHouseStore = defineStore("house", {
  state: () => ({
    houses: [] as House[],
    selectedHouse: null as House | null,
    error: null as string | null,
    isLoading: false,
  }),

  getters: {
    sortedHouses: (state) => {
      return [...state.houses].sort((a, b) => {
        if (a.address && b.address) {
          return a.address.localeCompare(b.address);
        }
        return 0;
      });
    },
    
    selectedHouseId: (state) => {
      return state.selectedHouse ? state.selectedHouse.houseId : null;
    }
  },

  actions: {
    setHouses(houses: House[]) {
      this.houses = houses || [];
    },

    selectHouse(house: House | null) {
      this.selectedHouse = house;
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
      this.isLoading = true;
      this.error = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.userData?.id) throw new Error("No user is logged in.");

        // Create a new house object with all required fields
        const newHouseData: House = {
          userId: userStore.userData.id,
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
        const userDocRef = doc(db, "users", userStore.userData.id);
        await updateDoc(userDocRef, { houses: arrayUnion(newHouseData) });

        // Immediately update local state
        this.houses.push(newHouseData);
        this.selectHouse(newHouseData);

        return newHouseData;
      } catch (err: any) {
        console.error("Failed to add house:", err);
        this.error = "Failed to add house: " + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteHouse(house: House) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const userStore = useUserStore();
        if (!userStore.userData?.id) throw new Error("No user is logged in.");

        // Find the exact house to delete by houseId
        const houseToDelete = this.houses.find(
          (h) => h.houseId === house.houseId
        );

        if (!houseToDelete) {
          throw new Error("House not found");
        }

        const userDocRef = doc(db, "users", userStore.userData.id);
        await updateDoc(userDocRef, { houses: arrayRemove(houseToDelete) });

        // Immediately update local state
        this.houses = this.houses.filter(h => h.houseId !== house.houseId);
        
        // If deleted house was selected, clear selection
        if (this.selectedHouse?.houseId === house.houseId) {
          this.selectedHouse = null;
        }

        return true;
      } catch (err: any) {
        console.error("Failed to delete house:", err);
        this.error = "Failed to delete house: " + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
}); 