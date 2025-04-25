<!--Script---------->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import NavigationBar from "@/components/NavigationBar.vue";
import FullCalendar from "@/components/FullCalendar.vue";
import HouseModal from "@/components/HouseModal.vue";
import EventModal from "@/components/EventModal.vue";
import type { EventData, HomeProps, HomeEmits } from "@/types/home";

// Props and Emits
const props = defineProps<HomeProps>();
const emit = defineEmits<HomeEmits>();

const router = useRouter();
const userStore = useUserStore();
const showSidebar = ref<boolean>(false);
const isMobileView = ref<boolean>(window.innerWidth <= 768);
const sidebarPersistent = ref<boolean>(true);

/**
 * STATE ARCHITECTURE - Modal Management
 * 
 * Home.vue serves as the container component that manages all modal state.
 * Following Vue best practices:
 * 1. Only one instance of each modal exists in the application
 * 2. Parent component (Home) controls modal visibility state
 * 3. Child components emit events up, parent handles state changes
 * 4. Data flows down as props from parent to child components
 */
const showHouseModal = ref<boolean>(false);
const showEventModal = ref<boolean>(false);
const calendarView = ref<string>("month");

// Event modal state - managed at this level to ensure single source of truth
const selectedEvent = ref<EventData | undefined>(undefined);
const eventStartDate = ref<string>("");
const eventEndDate = ref<string>("");

const toggleSidebar = (): void => {
    showSidebar.value = !showSidebar.value;
};

const toggleSidebarPersistent = (): void => {
    sidebarPersistent.value = !sidebarPersistent.value;
};

/**
 * Event handlers for child component events
 * 
 * Following the events-up, props-down pattern:
 * - Child components emit events when user interacts with them
 * - Parent handles these events and updates state accordingly
 * - Updated state is passed back down as props
 */
const handleAddHouse = (): void => {
    showHouseModal.value = true;
};

const handleCreateEvent = (): void => {
    showEventModal.value = true;
};

// Handle changing calendar view (day, week, month)
const handleViewChange = (view: string): void => {
    calendarView.value = view;
};

// Handle calendar event modal opening from FullCalendar
const handleOpenEventModal = (data: { event: EventData; startDate: string; endDate: string }): void => {
    selectedEvent.value = data.event;
    eventStartDate.value = data.startDate;
    eventEndDate.value = data.endDate;
    showEventModal.value = true;
};

// Handle creating an event from the modal
const handleEventCreate = async (eventData: EventData): Promise<any> => {
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

// Handle event updates from FullCalendar through EventModal
const handleEventUpdate = async (eventData: EventData): Promise<void> => {
    try {
        // Update event in Firestore through userStore
        await userStore.updateEvent(eventData);
        showEventModal.value = false;
    } catch (error) {
        console.error("Error updating event:", error);
        alert("Failed to update event. Please try again.");
    }
};

// Handle event deletion from FullCalendar through EventModal
const handleEventDelete = async (eventId: string): Promise<void> => {
    try {
        // Delete event in Firestore through userStore
        await userStore.deleteEvent(eventId);
        showEventModal.value = false;
    } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
    }
};

// Handle window resize to detect mobile view
const handleResize = (): void => {
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
            <!-- NavigationBar emits events up to this parent -->
            <NavigationBar :class="{ show: showSidebar, 'mobile-view': isMobileView }" :persistent="sidebarPersistent"
                @toggle-persistent="toggleSidebarPersistent" @add-house="handleAddHouse"
                @create-event="handleCreateEvent" @logout="userStore.logout" @change-view="handleViewChange" />

            <div class="main-content" :class="{ 'sidebar-visible': showSidebar }">
                <!-- FullCalendar emits events up to this parent -->
                <FullCalendar :user-id="userStore.userData?.id" :view="calendarView"
                    @open-event-modal="handleOpenEventModal" @create-event="handleEventCreate"
                    @update-event="handleEventUpdate" @delete-event="handleEventDelete" />
            </div>

            <!-- Modal components managed at parent level -->
            <!-- Single source of truth for HouseModal -->
            <HouseModal v-model="showHouseModal" @close="showHouseModal = false" />

            <!-- Single source of truth for EventModal -->
            <EventModal v-model="showEventModal" @close="showEventModal = false" @create="handleEventCreate"
                :houses="userStore.userData?.houses || []" :event="selectedEvent" :event-start-date="eventStartDate"
                :event-end-date="eventEndDate" />
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
    margin: 20px auto;
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