<template>
  <v-card class="sidebar" elevation="10">

    <div class="sidebar-logo">
      <v-img src="/assets/logo.png"></v-img>
    </div>
    <div class="user-profile-section ">
      <div class="user-row">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-avatar size="40" class="user-avatar" color="#5e91c1" v-bind="props" style="cursor: pointer">

              {{ getFirstLetterOfEmail() }}


            </v-avatar>
          </template>

          <v-list density="compact">
            <v-list-item @click="openProfileSettings">
              <template v-slot:prepend>
                <v-icon size="small">mdi-account-edit</v-icon>
              </template>
              <v-list-item-title>Profile Settings</v-list-item-title>
            </v-list-item>
            <v-list-item @click="userStore.logout">
              <template v-slot:prepend>
                <v-icon size="small">mdi-logout</v-icon>
              </template>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <div class="user-info">
          <div class="user-name">{{ userStore.userData?.fullName || 'Guest' }}</div>
          <div class="user-email">{{ userStore.userData?.email || 'No email provided' }}</div>
        </div>
      </div>
    </div>




    <!-- <div class="sidebar-content"> -->
    <div class="houses-section">
      <div class="header-row">
        <h3>My Houses</h3>
        <button @click="showAddHouseModal = true" class="add-house-btn" aria-label="Add house">+</button>
      </div>
    </div>
    <ul class="house-list">
      <li v-for="house in userStore.userData?.houses" :key="house.houseId" class="house-item"
        :class="{ 'house-item-active': house.houseId === userStore.selectedHouseId }"
        @click="userStore.selectHouse(house)">
        <div class="house-info">
          <div class="house-color" :style="{ backgroundColor: house.color || '#66b8ca' }"></div>
          <span class="house-address">{{ house.address }}</span>
        </div>
        <button @click.stop="deleteHouse(house.houseId)" class="delete-button" aria-label="Delete house">
          ×
        </button>
      </li>
    </ul>







    <!-- Add House Modal -->
    <v-dialog v-model="showAddHouseModal" max-width="450px">
      <v-card elevation="10" style="border-radius: 12px;">
        <v-card-title class="text-h6">Add New House</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addHouse">
            <v-text-field v-model="newHouse.address" label="Address" required></v-text-field>
            <v-text-field v-model="newHouse.contactnumber" label="Contact Number"></v-text-field>
            <v-color-picker v-model="newHouse.color" hide-inputs hide-canvas></v-color-picker>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addHouse">Add House</v-btn>
          <v-btn color="grey" text @click="showAddHouseModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>

</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";



const userStore = useUserStore();
const showAddHouseModal = ref(false);
const newHouse = ref({
  address: "",
  contactnumber: "",
  color: "#66b8ca"
});

// Function to get the first letter of the email
function getFirstLetterOfEmail() {
  if (userStore.userData?.email) {
    return userStore.userData.email.charAt(0).toUpperCase();
  }
  return 'U'; // Default letter if email not available
}

async function addHouse() {
  if (!newHouse.value.address) {
    alert("Please enter an address");
    return;
  }

  try {
    const houseData = {
      address: newHouse.value.address,
      contactnumber: newHouse.value.contactnumber || "",
      color: newHouse.value.color || "#66b8ca"
    };

    // Use the userStore's createHouse method which properly updates the main user document
    await userStore.createHouse(houseData);

    // Reset form and close modal
    newHouse.value = {
      address: "",
      contactnumber: "",
      color: "#66b8ca"
    };
    showAddHouseModal.value = false;
  } catch (error) {
    console.error("Error adding house:", error);
    alert("Failed to add house");
  }
}

async function deleteHouse(houseId) {
  if (confirm("Are you sure you want to delete this house?")) {
    try {
      // Find the house object by houseId
      const house = userStore.userData.houses.find(h => h.houseId === houseId);

      if (house) {
        // Use the userStore's deleteHouse method which properly updates the main user document
        await userStore.deleteHouse(house);
      } else {
        throw new Error("House not found");
      }
    } catch (error) {
      console.error("Error deleting house:", error);
      alert("Failed to delete house");
    }
  }
}

function openProfileSettings() {
  // This function will be implemented when profile settings are added
  console.log('Profile settings clicked');
}
</script>

<style scoped>
.sidebar {
  width: 310px;
  height: calc(100% - 15px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 240, 255, 0.295) 100%);
  font-family: 'Roboto', 'Arial', sans-serif;
  font-weight: normal;
  border-right: none;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: -310px;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  transition: left 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  z-index: 20;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-right: 1px solid #969494;
  backdrop-filter: blur(8px);
  /* Ribbon-like shape with arrow at the bottom */
  clip-path: polygon(0% 0%,
      100% 0%,
      100% 80%,
      100% 95%,
      85% 100%,
      0% 100%);
}

/* Add decorative arrow element */
.sidebar::after {}

@keyframes arrowGlow {
  0% {
    opacity: 0.6;
    transform: translateY(0);
  }

  100% {
    opacity: 0.9;
    transform: translateY(-3px);
  }
}

.sidebar.show {
  left: 0;
  animation: sidebarPulse 2.5s infinite alternate;
  box-shadow: 0 0 30px rgba(65, 105, 226, 0.4);
}

@keyframes sidebarPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 15px rgba(65, 105, 226, 0.4);
    border-right: none;
  }

  50% {
    transform: scale(1.01);
    box-shadow: 0 0 25px rgba(65, 105, 226, 0.7);
    border-right: none;
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 15px rgba(65, 105, 226, 0.4);
    border-right: none;
  }
}

.sidebar-logo {
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--success-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-top-left-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  animation: logoGlow 3s infinite alternate;
}

.logo-placeholder {
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
}

.sidebar-content {
  padding: 90px 0 0 0;
  /* Increased from 20px to 90px to move section down by 70px */
  flex-grow: 1;
}

.houses-section {
  padding-top: 48px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  animation: sectionHighlight 4s infinite alternate;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

h3 {
  font-size: 1.1rem;
  color: #333;
  text-align: left;
  font-weight: 500;
  margin: 0;
}

.add-house-btn {
  width: 24px;
  height: 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: all 0.3s ease;
  animation: buttonPulse 2s infinite;
}

@keyframes buttonPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(65, 105, 226, 0.7);
  }

  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 5px rgba(65, 105, 226, 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(65, 105, 226, 0);
  }
}

.house-list {
  list-style: none;
  padding-left: 10px;
  padding-right: 15px;
  margin: 0;
}

.house-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.house-item:hover {
  background-color: rgba(65, 105, 226, 0.08);
  border-left: 3px solid var(--primary-color);
  transform: translateX(5px);
}

.house-item-active {
  background-color: rgba(65, 105, 226, 0.12);
  font-weight: 500;
  border-left: 3px solid var(--primary-color);
  box-shadow: 0 3px 10px rgba(65, 105, 226, 0.15);
  animation: activeItemPulse 2s infinite alternate;
}

@keyframes activeItemPulse {
  0% {
    background-color: rgba(65, 105, 226, 0.12);
    box-shadow: 0 3px 10px rgba(65, 105, 226, 0.15);
  }

  100% {
    background-color: rgba(65, 105, 226, 0.2);
    box-shadow: 0 3px 15px rgba(65, 105, 226, 0.25);
  }
}

.house-info {
  display: flex;
  align-items: center;
  text-align: left;
  flex: 1;
}

.house-color {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border-radius: 2px;
  /* Square instead of circle */
}

.house-address {
  font-size: 0.9rem;
  color: #333;
  text-transform: uppercase;
}

.delete-button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  margin-left: 8px;
  transition: all 0.2s ease;
  color: var(--error-color);
}

.delete-button:hover {
  background-color: rgba(231, 50, 69, 0.1);
  transform: scale(1.1);
}

/* Mobile view styles */
@media (max-width: 768px) {
  .sidebar.mobile-view.show {
    width: 100vw;
    /* Cover whole screen */
    height: 100%;
    /* Use full height on mobile */
    margin-top: 0;
    /* Keep the ribbon-like shape with arrow at the bottom */
    clip-path: polygon(0% 0%,
        100% 0%,
        100% 85%,
        100% 95%,
        85% 100%,
        0% 100%);
  }

  /* Reposition the decorative arrow for mobile */
  .sidebar.mobile-view.show::after {
    bottom: 2%;
    right: 0;
    width: 10%;
    height: 10%;
  }

  .sidebar.mobile-view .sidebar-logo {
    border-radius: 0;
    height: 60px;
  }
}

.sidebar-logo {
  height: 64px;
}

.user-profile-section {

  /* Added to lower the section by 36px */
  padding: 0px 10px 10px 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-row {
  display: flex;


  align-items: center;
  width: 100%;
}

.user-avatar {
  margin-right: 12px;
  flex-shrink: 0;
  margin-top: -26px;
  transition: transform 0.2s ease;
  background-color: var(--primary-color) !important;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.avatar-letter {
  color: white;
  font-weight: 800;
  font-size: 16px;
  margin-top: -26px;
}

.user-info {
  flex: 1;
  min-width: 0;
  /* Enables text truncation */
  margin-right: 18px;
}

.user-name {
  font-weight: 500;
  font-size: 1.2rem;
  color: #000000;
  margin-bottom: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 1.1rem;
  font-weight: 400;
  padding-bottom: 20px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 14px;
}

.settings-btn {
  flex-shrink: 0;
  margin-left: auto;
}

.sidebar-footer {
  margin-top: auto;
  margin-bottom: 20px;
  padding: 0 16px;
}

@keyframes logoGlow {
  0% {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--success-color) 100%);
    box-shadow: 0 4px 8px rgba(65, 105, 226, 0.3);
  }

  100% {
    background: linear-gradient(135deg, var(--success-color) 0%, var(--primary-color) 100%);
    box-shadow: 0 4px 15px rgba(65, 105, 226, 0.7);
  }
}

@keyframes sectionHighlight {
  0% {
    background-color: transparent;
  }

  50% {
    background-color: rgba(65, 105, 226, 0.05);
  }

  100% {
    background-color: transparent;
  }
}
</style>