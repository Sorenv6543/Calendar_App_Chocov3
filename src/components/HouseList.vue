<template>
  <div class="houses-section pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="text-subtitle-1 font-weight-medium">My Houses</div>
      <v-btn icon variant="text" density="comfortable" color="primary" @click="showModal = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <div v-if="displayedHouses.length === 0" class="text-center py-4 text-body-2 text-grey">
      <v-icon icon="mdi-home-outline" size="large" color="grey" class="mb-2"></v-icon>
      <div>No houses added yet</div>
    </div>

    <v-slide-y-transition group>
      <v-card v-for="house in displayedHouses" :key="house.houseId" :class="`text-${getColorClass(house.color)}`"
        class="house-card mb-1" variant="outlined" link>
        <div class="d-flex align-center house-item">
          <v-checkbox v-model="house.selected" hide-details density="compact"></v-checkbox>
          <span class="ml-2 text-body-2 house-name">{{ house.address }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="x-small" @click.stop="confirmDelete(house)" class="remove-btn">
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-slide-y-transition>

    <HouseModal v-model="showModal" :is-visible="showModal" @closeModal="showModal = false"
      @houseAdded="handleHouseAdded" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "../stores/userStore";
import { auth } from "../auth";
import HouseModal from "./HouseModal.vue";

const userStore = useUserStore();
const showModal = ref(false);
const localHouses = ref([]);
const isInitialized = ref(false);

// Map house colors to Vuetify color classes
const colorMap = {
  '#66b8ca': 'blue',
  '#4169e2': 'indigo',
  '#8656c3': 'purple',
  '#e5564e': 'red',
  '#F4C530': 'amber',
  '#3CB371': 'green',
  '#FF7F50': 'deep-orange',
  '#6A5ACD': 'deep-purple',
  '#20B2AA': 'teal',
  '#FF69B4': 'pink'
};

// Get appropriate color class from hex color
const getColorClass = (hexColor) => {
  if (!hexColor) return 'primary';
  return colorMap[hexColor] || 'primary';
};

// Computed property to combine userStore houses with any local houses
const displayedHouses = computed(() => {
  // Get houses from userStore
  const storeHouses = userStore.userData?.houses || [];

  // Prefer store houses, but include any local houses that might not be in store yet
  // This ensures both locally added houses and server-fetched houses are shown
  const combinedHouses = [...storeHouses];

  // Add any local houses that aren't in the store yet (by houseId)
  localHouses.value.forEach(localHouse => {
    if (!combinedHouses.some(h => h.houseId === localHouse.houseId)) {
      combinedHouses.push(localHouse);
    }
  });

  // Make sure all houses have a selected property
  return combinedHouses.map(house => ({
    ...house,
    selected: typeof house.selected === 'boolean' ? house.selected : true
  }));
});

// Refresh houses from the store
const refreshHouses = async () => {
  console.log("Refreshing houses...");
  try {
    // Force a fetch from Firestore if user is authenticated
    if (auth.currentUser) {
      await userStore.fetchUserData(auth.currentUser);

      // Update our local reference with houses from store to maintain reactivity
      localHouses.value = userStore.userData?.houses ?
        JSON.parse(JSON.stringify(userStore.userData.houses)) : [];

      console.log("Houses refreshed from server:", localHouses.value.length);
    }
  } catch (error) {
    console.error("Error refreshing houses:", error);
  } finally {
    isInitialized.value = true;
  }
};

// Initialize component and set up watchers
onMounted(async () => {
  // Initial fetch of houses
  await refreshHouses();

  // Watch for any changes to userStore.userData.houses
  watch(() => userStore.userData?.houses, (newHouses) => {
    console.log("Houses changed in store:", newHouses?.length || 0);
    // Update local reference to store data
    if (newHouses && Array.isArray(newHouses)) {
      localHouses.value = JSON.parse(JSON.stringify(newHouses));
    }
  }, { deep: true });
});

const confirmDelete = async (house) => {
  if (confirm(`Are you sure you want to delete ${house.address}?`)) {
    try {
      await userStore.deleteHouse(house);
      console.log("House deleted, refreshing data");

      // Remove from local array immediately for responsive UI
      localHouses.value = localHouses.value.filter(h => h.houseId !== house.houseId);

      // Then refresh from server
      setTimeout(() => {
        refreshHouses();
      }, 300);
    } catch (error) {
      console.error("Error deleting house:", error);
      alert("Failed to delete house. Please try again.");
    }
  }
};

const handleHouseAdded = (newHouse) => {
  console.log("New house added in UI:", newHouse);

  // Add to local array immediately for responsive UI
  localHouses.value.push({
    ...newHouse,
    selected: true
  });

  // Then refresh from server after a short delay
  setTimeout(() => {
    refreshHouses();
  }, 300);
};
</script>

<style scoped>
.houses-section {
  width: 100%;
}

.house-card {
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 4px !important;
}

.house-item {
  padding: 8px 12px !important;
}

.house-name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.house-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.house-card .remove-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.house-card:hover .remove-btn {
  opacity: 1;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
