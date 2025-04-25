<!--Script---------->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import NavigationBar from "./NavigationBar.vue";
import FullCalendar from "./FullCalendar.vue";
import HouseModal from "./HouseModal.vue";
import EventModal from "./EventModal.vue";

// Define types
interface EventData {
  userId?: string;
  title: string;
  start: string;
  end: string;
  houseId?: string;
  description?: string;
  [key: string]: any;
}

const router = useRouter();
const userStore = useUserStore();
const showSidebar = ref(false);
const isMobileView = ref(window.innerWidth <= 768);
const sidebarPersistent = ref(true);
const showHouseModal = ref(false);
const showEventModal = ref(false);
const calendarView = ref("month");

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const toggleSidebarPersistent = () => {
  sidebarPersistent.value = !sidebarPersistent.value;
};

const handleAddHouse = () => {
  showHouseModal.value = true;
};

const handleCreateEvent = () => {
  showEventModal.value = true;
};

// Handle changing calendar view (day, week, month)
const handleViewChange = (view: string) => {
  calendarView.value = view;
};

// Handle creating an event from the modal
const handleEventCreate = async (eventData: EventData) => {
  try {
    // Add user ID to the event data
    if (userStore.userData) {
      eventData.userId = userStore.userData.id;
    }

    // Call the store method to save event to the database
    const result = await userStore.createEvent(eventData);

    // Close the modal first for better perceived performance
    showEventModal.value = false;

    // Return the result in case it's needed
    return result;
  } catch (error) {
    console.error("Error creating event:", error);
    alert("Failed to create event. Please try again.");
    throw error;
  }
};

// Handle window resize to detect mobile view
const handleResize = () => {
  isMobileView.value = window.innerWidth <= 768;
};

onMounted(() => {
  userStore.initAuthListener();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<!--Template----------->

<template>
  <div v-if="userStore.userData" class="app-background">
    <div class="home-container">
      <NavigationBar :class="{ show: showSidebar, 'mobile-view': isMobileView }" :persistent="sidebarPersistent"
        @toggle-persistent="toggleSidebarPersistent" @add-house="handleAddHouse" @create-event="handleCreateEvent"
        @logout="userStore.logout" @change-view="handleViewChange" />

      <div class="main-content" :class="{ 'sidebar-visible': showSidebar }">
        <FullCalendar :user-id="userStore.userData?.id" :view="calendarView" />
      </div>

      <!-- House Modal -->
      <HouseModal v-model="showHouseModal" @close="showHouseModal = false" />

      <!-- Event Modal -->
      <!-- Pass houses to the modal explicitly -->
      <EventModal v-model="showEventModal" @close="showEventModal = false" @create="handleEventCreate"
        :houses="userStore.userData?.houses || []" />
    </div>
  </div>
  <div v-else>
    <div class="loader"></div>
  </div>
</template>

<!--Style----------->
<style scoped>
.app-background {
  min-height: 100vh;
  width: 100%;
}

.home-container {
  display: flex;
  height: 100vh;
  width: 100%;
  position: relative;

  background-color: #b7bfd5;
}

.main-content {
  flex: 1;
  position: relative;

  transform: translateX(0);
  transition: transform 0.3s ease;
  will-change: transform;
}

.main-content.sidebar-visible {
  transform: translateX(310px);
}

.calendar-wrapper {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

#logout {
  height: 30px;
}

/* Sidebar is hidden by default on all screen sizes */
.sidebar-hidden {
  position: fixed;
  transform: translateX(0);
  transition: transform 0.3s ease;
  z-index: 20;
  height: 100vh;
  will-change: transform;
}

/* Sidebar becomes visible when .show class is applied */
.sidebar-hidden.show {
  transform: translateX(0);
}

/* Ensure consistent behavior at all screen sizes */
@media (max-width: 768px) {
  .home-container {
    padding-left: 0;
  }

  /* Make sidebar cover whole screen in mobile */
  .main-content.sidebar-visible {
    transform: translateX(0);
    opacity: 0.3;
    pointer-events: none;
  }
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #36b5f4;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
