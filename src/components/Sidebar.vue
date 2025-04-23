<template>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      @mouseenter="rail = false"
      @mouseleave="rail = !isMobile"
      :permanent="!isMobile"
      :temporary="isMobile"
      :location="location"
      width="300"
      class="calendar-sidebar"
      rounded="lg"
      elevation="4"
    >
      <!-- User Profile Section -->
      <div class="user-profile pa-4">
        <v-avatar
          size="56"
          color="primary"
          class="elevation-2 mb-2"
          v-if="!rail || isMobile"
        >
          <span class="text-h6 font-weight-medium">{{ userInitials }}</span>
        </v-avatar>
        <v-avatar
          size="36"
          color="primary"
          class="elevation-2 mb-2"
          v-else
        >
          <span class="text-subtitle-2 font-weight-medium">{{ userInitials }}</span>
        </v-avatar>
        
        <div v-if="!rail || isMobile" class="user-info mt-2">
          <div class="text-h6">{{ user.name }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ user.email }}</div>
        </div>
      </div>
  
      <v-divider></v-divider>
  
      <!-- Calendar Controls -->
      <div class="calendar-controls pa-4" v-if="!rail || isMobile">
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-plus"
          class="mb-4 create-event-btn"
          elevation="1"
          @click="createEvent"
        >
          Create Event
        </v-btn>
  
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          location="bottom"
          transition="scale-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              block
              variant="outlined"
              class="mb-4 date-picker-btn"
              prepend-icon="mdi-calendar"
              v-bind="props"
            >
              {{ formattedCurrentDate }}
            </v-btn>
          </template>
          <v-date-picker v-model="currentDate" @update:model-value="dateMenu = false"></v-date-picker>
        </v-menu>
      </div>
      
      <div class="calendar-controls-rail pa-2" v-else>
        <v-btn
          icon
          color="primary"
          size="small"
          class="mb-4"
          @click="createEvent"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        
        <v-btn
          icon
          variant="outlined"
          size="small"
          class="mb-4"
          @click="dateMenu = true"
        >
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </div>
  
      <v-divider></v-divider>
  
      <!-- Houses Section -->
      <div class="houses-section pa-4">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="text-subtitle-1 font-weight-medium">My Houses</div>
          <v-btn
            icon
            variant="text"
            density="comfortable"
            color="primary"
            @click="addHouse"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
  
        <v-slide-y-transition group>
          <v-card
            v-for="house in houses"
            :key="house.id"
            :color="house.color"
            class="house-card mb-2"
            variant="outlined"
            :ripple="false"
            @click="toggleHouseSelection(house)"
          >
            <div class="d-flex align-center pa-3">
              <v-checkbox
                v-model="house.selected"
                :color="house.color"
                hide-details
                density="compact"
                @click.stop="toggleHouseSelection(house)"
              ></v-checkbox>
              <span class="ml-2 text-body-2">{{ house.name }}</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                variant="text"
                size="small"
                @click.stop="removeHouse(house)"
                class="remove-btn"
              >
                <v-icon size="small">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-slide-y-transition>
      </div>
  
      <v-divider></v-divider>
  
      <!-- View Options -->
      <div class="view-options pa-4" v-if="!rail || isMobile">
        <div class="text-subtitle-1 font-weight-medium mb-3">View</div>
        <v-btn-group
          variant="outlined"
          divided
          class="w-100"
        >
          <v-btn
            v-for="view in viewOptions"
            :key="view.value"
            :value="view.value"
            :active="currentView === view.value"
            @click="currentView = view.value"
            class="flex-1"
          >
            {{ view.label }}
          </v-btn>
        </v-btn-group>
      </div>
  
      <template v-slot:append>
        <div class="pa-4">
          <v-btn
            v-if="!isMobile"
            block
            variant="tonal"
            @click="rail = !rail"
            :prepend-icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          >
            {{ rail ? '' : 'Collapse' }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { format } from 'date-fns';
  
  // Props
  const props = defineProps({
    location: {
      type: String,
      default: 'left'
    }
  });
  
  // Emits
  const emit = defineEmits(['create-event', 'add-house', 'remove-house', 'toggle-house', 'change-view', 'change-date']);
  
  // State
  const drawer = ref(true);
  const rail = ref(false);
  const isMobile = ref(false);
  const dateMenu = ref(false);
  const currentDate = ref(new Date().toISOString().substr(0, 10));
  const currentView = ref('month');
  
  // User data
  const user = ref({
    name: 'Corey Perez',
    email: 'corbperez@gmail.com'
  });
  
  // Houses data
  const houses = ref([
    { id: 1, name: '444 CONTROL HOUSE', color: 'green', selected: true },
    { id: 2, name: '444 OLD MAIN ST', color: 'purple', selected: true }
  ]);
  
  // View options
  const viewOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ];
  
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
  const createEvent = () => {
    emit('create-event');
  };
  
  const addHouse = () => {
    emit('add-house');
  };
  
  const removeHouse = (house) => {
    emit('remove-house', house);
  };
  
  const toggleHouseSelection = (house) => {
    house.selected = !house.selected;
    emit('toggle-house', house);
  };
  
  // Watch for changes
  watch(currentView, (newView) => {
    emit('change-view', newView);
  });
  
  watch(currentDate, (newDate) => {
    emit('change-date', newDate);
  });
  
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
  
  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
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
  
  .house-card {
    transition: all 0.2s ease;
    border-radius: 8px;
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
  </style>