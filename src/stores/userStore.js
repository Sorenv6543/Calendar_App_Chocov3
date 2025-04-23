import { defineStore } from "pinia";
import { auth, onAuthStateChangedListener, logoutUser } from "../auth";
import { fetchUserData } from "../user-utils";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
          this.houses = this.userData.houses;
        } else {
          this.houses = [];
          console.warn("Houses property not found or not an array.");
        }
      } catch (err) {
        this.error = "Failed to load user data: " + err.message;
        console.error("Error fetching user data:", err);
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
        const newHouseData = {
          userId: this.userData.id,
          houseId: this.generateHouseId(10),
          ...newHouse,
        };
        const userDocRef = doc(db, "users", this.userData.id);
        await updateDoc(userDocRef, { houses: arrayUnion(newHouseData) });
        await this.fetchUserData(auth.currentUser);
      } catch (err) {
        this.error = "Failed to add house.";
        console.error(err);
      }
    },
    async deleteHouse(house) {
      try {
        if (!this.userData?.id) throw new Error("No user is logged in.");
        const userDocRef = doc(db, "users", this.userData.id);
        await updateDoc(userDocRef, { houses: arrayRemove(house) });
        await this.fetchUserData(auth.currentUser);
      } catch (err) {
        console.error("Failed to delete house:", err);
        this.error = "Failed to delete house.";
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
