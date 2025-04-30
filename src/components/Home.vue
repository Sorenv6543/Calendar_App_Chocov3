<!--Script---------->

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { useHouseStore } from "../stores/houseStore";
import { useEventStore } from "../stores/eventStore";
import { useUIStore } from "../stores/uiStore";
import FullCalendar from "./FullCalendar";
import HouseModal from "./HouseModal.vue";
import EventModal from "./EventModal.vue";

const router = useRouter();
const userStore = useUserStore();
const houseStore = useHouseStore();
const eventStore = useEventStore();
const uiStore = useUIStore();

/**
 * Event handlers for child component events
 * 
 * Following the events-up, props-down pattern:
 * - Child components emit events when user interacts with them
 * - Parent handles these events and updates state accordingly via stores
 * - Updated state is passed back down as props
 */
const handleAddHouse = () => {
  uiStore.openHouseModal();
};

// Handle changing calendar view (day, week, month)
const handleViewChange = (view: string) => {
  uiStore.setCalendarView(view);
};

// Handle calendar event modal opening from FullCalendar
const handleOpenEventModal = (data) => {
  uiStore.openEventModal({
    event: data.event,
    startDate: data.startDate,
    endDate: data.endDate
  });
};

// Handle creating an event from the modal
const handleEventCreate = async (eventData) => {
  try {
    // Call the store method to save event to the database
    const result = await eventStore.createEvent(eventData);

    // Close the modal first for better perceived performance
    uiStore.closeEventModal();

    // Return the result in case it's needed
    return result;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Handle event updates from FullCalendar through EventModal
const handleEventUpdate = async (eventData) => {
  try {
    // Update event in Firestore through eventStore
    await eventStore.updateEvent(eventData);
    uiStore.closeEventModal();
  } catch (error) {
    console.error("Error updating event:", error);
  }
};

// Handle event deletion from FullCalendar through EventModal
const handleEventDelete = async (eventId) => {
  try {
    // Delete event in Firestore through eventStore
    await eventStore.deleteEvent(eventId);
    uiStore.closeEventModal();
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

// Handle window resize to detect mobile view
const handleResize = () => {
  uiStore.updateViewportSize();
};

onMounted(() => {
  // Initialize stores
  userStore.initAuthListener();
  eventStore.subscribeToEvents();

  // Set up window resize listener
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  // Clean up event subscriptions
  eventStore.unsubscribeFromEvents();

  // Remove resize listener
  window.removeEventListener("resize", handleResize);
});
</script>

<!--Template----------->

<template>
  <div v-if="userStore.userData" class="app-background">
    <div class="home-container">
      <!-- FullCalendar emits events up to this parent -->
      <div class="main-content">
        <FullCalendar :user-id="userStore.userData?.id" :view="uiStore.calendarView"
          @open-event-modal="handleOpenEventModal" @create-event="handleEventCreate" @update-event="handleEventUpdate"
          @delete-event="handleEventDelete" />
      </div>

      <!-- Modal components managed at parent level -->
      <HouseModal v-model="uiStore.showHouseModal" @close="uiStore.closeHouseModal()" />

      <EventModal v-model="uiStore.showEventModal" @close="uiStore.closeEventModal()" @create="handleEventCreate"
        :houses="houseStore.sortedHouses" :event="uiStore.eventModalData.event"
        :event-start-date="uiStore.eventModalData.startDate" :event-end-date="uiStore.eventModalData.endDate" />
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
  margin-top: -25px;
  margin-left: -25px;
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
