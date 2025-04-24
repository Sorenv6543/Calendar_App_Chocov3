<template>
  <div class="sidebar-wrapper">
    <v-navigation-drawer v-model="drawer" :rail="rail" @mouseenter="rail = false" @mouseleave="handleMouseLeave"
      :permanent="!isMobile" :temporary="isMobile" :location="location" width="300" class="calendar-sidebar"
      rounded="lg" elevation="4">
      <!-- User Profile Section -->
      <div class="user-profile pa-3">
        <v-avatar size="56" color="primary" class="elevation-2 mb-2" v-if="!rail || isMobile">
          <span class="text-h6 font-weight-medium">{{ userInitials }}</span>
        </v-avatar>
        <v-avatar size="36" color="primary" class="elevation-2 mb-2" v-else>
          <span class="text-subtitle-2 font-weight-medium">{{ userInitials }}</span>
        </v-avatar>

        <div v-if="!rail || isMobile" class="user-info mt-1">
          <div class="text-h6">{{ user.name }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ user.email }}</div>
        </div>
      </div>

      <v-divider class="mb-1"></v-divider>

      <!-- Calendar Controls -->
      <div class="calendar-controls pa-2" v-if="!rail || isMobile">
        <v-btn block color="primary" prepend-icon="mdi-plus" class="mb-2 create-event-btn" elevation="1"
          @click="createEvent">
          Create Event
        </v-btn>

        <v-menu v-model="dateMenu" :close-on-content-click="false" location="bottom" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn block variant="outlined" class="mb-2 date-picker-btn" prepend-icon="mdi-calendar" v-bind="props">
              {{ formattedCurrentDate }}
            </v-btn>
          </template>
          <v-date-picker v-model="currentDate" @update:model-value="dateMenu = false"></v-date-picker>
        </v-menu>
      </div>

      <div class="calendar-controls-rail pa-2" v-else>
        <v-btn icon color="primary" size="small" class="mb-2" @click="createEvent">
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <v-btn icon variant="outlined" size="small" class="mb-2" @click="dateMenu = true">
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </div>

      <v-divider class="my-1"></v-divider>

      <!-- Houses Section -->
      <div class="houses-section pa-2">
        <div class="d-flex align-center justify-space-between mb-2">
          <v-btn icon variant="text" density="comfortable" color="primary">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <div class="text-subtitle-1 font-weight-medium flex-grow-1">My Houses</div>
          <v-btn icon variant="text" density="comfortable" color="primary" @click="addHouse">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

        <div v-if="displayedHouses.length === 0" class="text-center py-2 text-body-2 text-grey">
          <v-icon icon="mdi-home-outline" size="large" color="grey" class="mb-1"></v-icon>
          <div>No houses added yet</div>
        </div>

        <v-slide-y-transition group>
          <v-card v-for="house in displayedHouses" :key="house.houseId" :class="`text-${getColorClass(house.color)}`"
            class="house-card mb-1" variant="outlined" :ripple="false" @click="toggleHouseSelection(house)">
            <div class="d-flex align-center house-item">
              <v-checkbox v-model="house.selected" hide-details density="compact"
                @click.stop="toggleHouseSelection(house)"></v-checkbox>
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

      <v-divider class="my-1"></v-divider>

      <!-- View Options -->
      <div class="view-options pa-2" v-if="!rail || isMobile">
        <v-btn-group variant="outlined" divided class="w-100 view-btn-group d-flex justify-center">
          <v-btn v-for="view in viewOptions" :key="view.value" :value="view.value" :active="currentView === view.value"
            @click="currentView = view.value" class="flex-1 view-btn">
            {{ view.label }}
          </v-btn>
        </v-btn-group>
      </div>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn v-if="!isMobile" block variant="tonal" @click="rail = !rail"
            :prepend-icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'">
            {{ rail ? '' : 'Collapse' }}
          </v-btn>
          <v-btn v-if="!isMobile && !rail" block variant="outlined" class="mt-2" @click="$emit('toggle-persistent')">
            {{ persistent ? 'Auto-collapse' : 'Keep expanded' }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Confirmation Dialog for Delete -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px" class="delete-dialog">
      <v-card class="delete-confirm-card">
        <v-card-title class="delete-dialog-title">
          <v-icon color="error" size="24" class="mr-2">mdi-alert-circle</v-icon>
          Confirm Delete
        </v-card-title>

        <v-card-text class="delete-dialog-text">
          Are you sure you want to delete <strong>{{ houseToDelete?.address }}</strong>? This action cannot be
          undone.
        </v-card-text>

        <v-card-actions class="delete-dialog-actions">
          <v-spacer></v-spacer>

          <v-btn color="grey" variant="text" @click="confirmDeleteDialog = false" class="cancel-btn">
            Cancel
          </v-btn>

          <v-btn color="error" variant="elevated" @click="deleteHouse" class="confirm-delete-btn">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import { useUserStore } from "../stores/userStore";
import { auth } from "../auth";
import HouseModal from "./HouseModal.vue";

// Props
const props = defineProps({
  location: {
    type: String,
    default: 'left'
  },
  persistent: {
    type: Boolean,
    default: false
  }
});

// Store
const userStore = useUserStore();

// Emits
const emit = defineEmits(['create-event', 'add-house', 'remove-house', 'toggle-house', 'change-view', 'change-date', 'toggle-persistent']);

// State
const drawer = ref(true);
const rail = ref(false);
const isMobile = ref(false);
const dateMenu = ref(false);
const currentDate = ref(new Date().toISOString().substr(0, 10));
const currentView = ref('month');
const showModal = ref(false);
const localHouses = ref([]);
const confirmDeleteDialog = ref(false);
const houseToDelete = ref(null);

// User data
const user = ref({
  name: 'Corey Perez',
  email: 'corbperez@gmail.com'
});

// View options
const viewOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];

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

// Computed
const userInitials = computed(() => {
  return user.value.name
    .split(' ')
    .map(name => name[0])
    .join('');
});

const formattedCurrentDate = computed(() => {
  try {
    return format(new Date(currentDate.value), 'MMMM d, yyyy');
  } catch (e) {
    return currentDate.value;
  }
});

// Methods
const handleMouseLeave = () => {
  if (!props.persistent) {
    rail.value = !isMobile.value;
  }
};

const createEvent = () => {
  emit('create-event');
};

const addHouse = () => {
  showModal.value = true;
};

const confirmDelete = (house) => {
  houseToDelete.value = house;
  confirmDeleteDialog.value = true;
};

const deleteHouse = async () => {
  try {
    const house = houseToDelete.value;
    if (!house) return;

    await userStore.deleteHouse(house);
    console.log("House deleted, refreshing data");

    // Remove from local array immediately for responsive UI
    localHouses.value = localHouses.value.filter(h => h.houseId !== house.houseId);

    // Close the dialog
    confirmDeleteDialog.value = false;
    houseToDelete.value = null;
  } catch (error) {
    console.error("Error deleting house:", error);
    alert("Failed to delete house. Please try again.");
  }
};

const toggleHouseSelection = (house) => {
  house.selected = !house.selected;
  emit('toggle-house', house);
};

const handleHouseAdded = (newHouse) => {
  console.log("New house added in UI:", newHouse);

  // Add to local array immediately for responsive UI
  localHouses.value.push({
    ...newHouse,
    selected: true
  });
};

// Refresh houses from the store
const refreshHouses = async () => {
  console.log("Refreshing houses in sidebar...");
  try {
    // Force a fetch from Firestore if user is authenticated
    if (auth.currentUser) {
      await userStore.fetchUserData(auth.currentUser);

      // Update our local reference with houses from store to maintain reactivity
      localHouses.value = userStore.userData?.houses ?
        JSON.parse(JSON.stringify(userStore.userData.houses)) : [];
    }
  } catch (error) {
    console.error("Error refreshing houses:", error);
  }
};

// Watch for changes
watch(currentView, (newView) => {
  emit('change-view', newView);
});

watch(currentDate, (newDate) => {
  emit('change-date', newDate);
});

// Watch for changes to userStore.userData.houses
watch(() => userStore.userData?.houses, (newHouses) => {
  console.log("Houses changed in store (sidebar):", newHouses?.length || 0);
  // Update local reference to store data
  if (newHouses && Array.isArray(newHouses)) {
    localHouses.value = JSON.parse(JSON.stringify(newHouses));
  }
}, { deep: true });

// Check for mobile on mount and resize
const checkMobile = () => {
  isMobile.value = window.innerWidth < 960;
  if (isMobile.value) {
    rail.value = false;
    drawer.value = false;
  } else {
    drawer.value = true;
  }
};

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Initial fetch of houses
  await refreshHouses();
});
</script>

<style scoped>
.calendar-sidebar {
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.houses-section {
  width: 100%;
  max-height: 45vh;
  overflow-y: auto;
}

.house-card {
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 6px !important;
  width: 100%;
  box-shadow: 5px 2px 2px rgba(0, 0, 0, 0.103) !important;
}

.house-item {
  padding: 3px 8px !important;
  width: 100%;
}

.house-name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 170px;
}

.house-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.house-card .remove-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.house-card:hover .remove-btn {
  opacity: 1;
}

.create-event-btn {
  transition: transform 0.2s ease;
}

.create-event-btn:hover {
  transform: translateY(-2px);
}

.date-picker-btn {
  transition: background-color 0.2s ease;
}

/* Ensure proper spacing in rail mode */
.v-navigation-drawer--rail .calendar-controls-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-btn-group {
  height: auto !important;
}

.view-btn {
  min-height: 40px !important;
  padding: 0 12px !important;
  font-size: 1.1rem !important;
  font-weight: 500 !important;
}

/* Delete Confirmation Dialog Styles */
.delete-dialog :deep(.v-card) {
  border-radius: 16px;
  overflow: hidden;
}

.delete-confirm-card {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
}

.delete-dialog-title {
  padding: 20px;
  background-color: rgba(231, 50, 69, 0.1);
  color: var(--error-color);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.delete-dialog-text {
  padding: 24px 20px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
  line-height: 1.5;
}

.delete-dialog-actions {
  padding: 12px 20px 20px;
}

.cancel-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  margin-right: 8px;
}

.confirm-delete-btn {
  background-color: var(--error-color) !important;
  color: white;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  padding: 0 20px;
  height: 36px;
}

.confirm-delete-btn:hover {
  box-shadow: 0 4px 12px rgba(231, 50, 69, 0.3) !important;
  transform: translateY(-2px);
}
</style>