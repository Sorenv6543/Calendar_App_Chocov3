<!--Script---------->

<script setup>
//imports
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { defineProps } from "vue";
import { auth } from "../auth";
import { db } from "../firebaseConfig";
import { useUserStore } from "../stores/userStore";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onMounted, ref, onBeforeUnmount, watch, computed } from "vue";
import debounce from 'lodash/debounce';
// Import Vuetify components
import TimePicker from './TimePicker.vue';
import { useTimeManagement } from '../composables/useTimeManagement';
// Import the new EventModal component
import EventModal from './EventModal.vue';

const userStore = useUserStore();
// Replace these refs
const isEventModalVisible = ref(false);
const isEditMode = ref(false);
const selectedEventId = ref(null);
const selectedEvent = ref(null);
const eventStartDate = ref("");
const eventEndDate = ref("");
const calendarRef = ref(null);
const calendarHeight = ref(window.innerHeight - 20); // Set initial height minus some padding
const selectedHouse = ref(null);

// Use the time management composable
const {
  checkInTimeDialog,
  checkOutTimeDialog,
  turncheckintime,
  turncheckouttime,
  updateCheckInTime,
  updateCheckOutTime
} = useTimeManagement();

const props = defineProps({
  userId: { type: String, required: true },
  selectedHouseId: { type: String, default: null },
});

const viewOptions = [
  { title: 'Month', value: 'dayGridMonth' },
  { title: 'Week', value: 'timeGridWeek' },
  { title: 'Day', value: 'timeGridDay' }
];

const currentView = ref('dayGridMonth');

const changeCalendarView = (view) => {
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().changeView(view);
    currentView.value = view;
  }
};

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "",                       // Remove buttons from left
    center: "title",                       // Keep title centered
    right: "",                       // Remove buttons from right
  },
  initialView: "dayGridMonth",
  height: calendarHeight.value, // Use dynamic height
  eventDidMount: (info) => {
    // Set the event color as a CSS variable
    info.el.style.setProperty('--event-color', info.event.extendedProps.color || '#2979ff');
    info.el.style.backgroundColor = info.event.extendedProps.color || '#2979ff';
    info.el.style.opacity = '1';
  },
  dayCellDidMount: (arg) => {
    // Get the date in YYYY-MM-DD format
    const cellDate = arg.date.toISOString().split('T')[0];
    // Check if the cell date is today
    // Check all events for a turn on this date
    const api = calendarRef.value?.getApi();
    const events = api ? api.getEvents() : [];

    // Find any event that has a turn on this date
    const hasTurnOnDay = events.some(event => {
      return event.extendedProps?.turn === true &&
        event.extendedProps?.turndate === cellDate;
    });

    // Apply class if this day has a turn
    if (hasTurnOnDay) {
      arg.el.classList.add('has-turn-day');
    }
  },
  datesSet: (dateInfo) => {
    // Use the debounced refresh after view changes
    if (calendarRef.value?.getApi()) {
      // First refetch events
      calendarRef.value.getApi().refetchEvents();
      // Then refresh highlights (debounced)
      debouncedRefreshHighlights();
    }
  },
  selectable: true,
  select: handleDateSelect,
  eventClick: editEvent,
  events: fetchEvents,
  eventResize: handleEventResize,
  // Enable dragging and resizing
  editable: true,
  // Add handler for drag-and-drop
  eventDrop: handleEventDrop,
  // Add virtual scrolling for better performance with many events
  dayMaxEventRows: true,

  // Preloading of events for faster rendering
  lazyFetching: true,

  // Optimize rendering
  rerenderDelay: 50,
};

// Handle window resize to update calendar height
const handleResize = () => {
  calendarHeight.value = window.innerHeight - 20; // Subtract padding
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().setOption('height', calendarHeight.value);
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);

  // Set up a watcher for when the calendar is initialized
  const checkCalendarReady = setInterval(() => {
    if (calendarRef.value && calendarRef.value.getApi) {
      clearInterval(checkCalendarReady);

      // Initial load of turn day highlights
      // Give the calendar a moment to fully initialize
      setTimeout(() => {
        refreshTurnDayHighlights();
      }, 300);
    }
  }, 100);

  // Initial resize call
  handleResize();
});

// Watch for changes in selectedHouseId
watch(() => props.selectedHouseId, (newHouseId) => {
  if (newHouseId && userStore.userData?.houses) {
    // Find the house in the user's houses array that matches the selected ID
    const house = userStore.userData.houses.find(h => h.houseId === newHouseId);
    if (house) {
      selectedHouse.value = house;
    }
  } else {
    selectedHouse.value = null;
  }
}, { immediate: true });

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const closeEventModal = () => {
  console.log("Closing event modal");
  isEventModalVisible.value = false;
  isEditMode.value = false;
  selectedEvent.value = null;
  selectedEventId.value = null;
};

async function fetchEvents(fetchInfo, successCallback, failureCallback) {
  try {
    const q = query(
      collection(db, "events"),
      where("userId", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    successCallback(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    failureCallback(error);
  }
}

function handleDateSelect(selectInfo) {
  isEventModalVisible.value = true;
  isEditMode.value = false;
  console.log('handleDateSelect: isEventModalVisible set to', isEventModalVisible.value);
  const selectedDate = selectInfo.startStr.split("T")[0];
  eventStartDate.value = selectedDate;
  eventEndDate.value = selectedDate;
  selectedEvent.value = null;

  calendarRef.value.getApi().unselect();
}

// Function to refresh all day cells to show turn highlights
function refreshTurnDayHighlights() {
  const api = calendarRef.value?.getApi();
  if (!api) return;

  // Use requestAnimationFrame to perform DOM operations in the next paint cycle
  requestAnimationFrame(() => {
    // Get all events and dates with turns first (data preparation)
    const events = api.getEvents();
    const turnDates = events
      .filter(event => event.extendedProps?.turn === true && event.extendedProps?.turndate)
      .map(event => event.extendedProps.turndate);

    // Create a Set for faster lookups
    const turnDatesSet = new Set(turnDates);

    // Batch DOM operations by minimizing reads before writes
    const cells = document.querySelectorAll('.fc-daygrid-day');

    // Process all cells in a single pass
    cells.forEach(cell => {
      const cellDate = cell.getAttribute('data-date');
      const shouldHaveClass = turnDatesSet.has(cellDate);
      const hasClass = cell.classList.contains('has-turn-day');

      // Only manipulate DOM when needed
      if (shouldHaveClass && !hasClass) {
        cell.classList.add('has-turn-day');
      } else if (!shouldHaveClass && hasClass) {
        cell.classList.remove('has-turn-day');
      }
    });
  });
}

// Create a debounced version of refreshTurnDayHighlights
const debouncedRefreshHighlights = debounce(() => {
  refreshTurnDayHighlights();
}, 200);

// Update the handleCreateEvent function to use debounced refresh
async function handleCreateEvent(eventData) {
  // Add userId to the event data
  eventData.userId = auth.currentUser.uid;

  try {
    const docRef = await addDoc(collection(db, "events"), eventData);
    eventData.id = docRef.id;

    // Refresh the calendar
    calendarRef.value.getApi().refetchEvents();

    // Use the debounced refresh function only once
    debouncedRefreshHighlights();
  } catch (error) {
    console.error("Error adding event:", error);
    alert("Failed to create event. Please try again.");
  }
}

function editEvent(clickInfo) {
  isEventModalVisible.value = true;
  isEditMode.value = true;
  selectedEventId.value = clickInfo.event.id;
  selectedEvent.value = clickInfo.event;
  console.log("Event clicked, showing modal:", isEventModalVisible.value);
  console.log("Selected event details:", clickInfo.event);
}

// Update the handleEventUpdate function to refresh day cells after updating an event
async function handleEventUpdate(updatedEvent) {
  try {
    // Update event in Firebase
    const eventRef = doc(db, "events", selectedEventId.value);
    await updateDoc(eventRef, updatedEvent);

    // Update local calendar display
    const calendarApi = calendarRef.value.getApi();
    const event = calendarApi.getEventById(selectedEventId.value);
    if (event) {
      event.setProp('title', updatedEvent.title);
      event.setStart(updatedEvent.start);
      event.setEnd(updatedEvent.end);
      event.setExtendedProp('color', updatedEvent.extendedProps.color);
      event.setExtendedProp('eventnotes', updatedEvent.extendedProps.eventnotes);
      event.setExtendedProp('turn', updatedEvent.extendedProps.turn);
      event.setExtendedProp('turndate', updatedEvent.extendedProps.turndate);
      event.setExtendedProp('turncheckintime', updatedEvent.extendedProps.turncheckintime);
      event.setExtendedProp('turncheckouttime', updatedEvent.extendedProps.turncheckouttime);
    }

    // Refresh events from server
    calendarApi.refetchEvents();

    // Use the debounced refresh function
    debouncedRefreshHighlights();
  } catch (error) {
    console.error("Error updating event:", error);
    alert("Failed to update event. Please try again.");
  }
}

// Update deleteEvent
const deleteEvent = async () => {
  try {
    const eventRef = doc(db, "events", selectedEventId.value);
    await deleteDoc(eventRef);

    const calendarApi = calendarRef.value.getApi();
    const event = calendarApi.getEventById(selectedEventId.value);
    if (event) {
      event.remove();
    }

    // Refresh events to ensure complete sync with Firebase
    calendarApi.refetchEvents();

    // Use the debounced refresh function
    debouncedRefreshHighlights();
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Failed to delete event. Please try again.");
  }
};

async function handleEventResize(eventResizeInfo) {
  try {
    const { id, start, end } = eventResizeInfo.event;

    const updatedEvent = {
      start: start.toISOString(),
      end: end ? end.toISOString() : null,
    };

    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, updatedEvent);

    console.log(`Event ${id} resized successfully in Firestore.`);
  } catch (error) {
    console.error("Error resizing event in Firestore:", error);
  }
}

// Add computed property to filter view options
const filteredViewOptions = computed(() => {
  return viewOptions.filter(option => option.value !== currentView.value);
});

// Function to navigate to previous month/week/day
const goToPrev = () => {
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().prev();
  }
};

// Function to navigate to next month/week/day
const goToNext = () => {
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().next();
  }
};

// Add the eventDrop handler function
async function handleEventDrop(eventDropInfo) {
  try {
    const { id, start, end } = eventDropInfo.event;

    // Prepare the updated data, ensuring proper date formatting
    const updatedEvent = {
      start: start ? start.toISOString() : null, // Handle potential null start
      end: end ? end.toISOString() : null, // Handle potential null end
    };

    // Get a reference to the Firestore document
    const eventRef = doc(db, "events", id);
    // Update the document in Firestore
    await updateDoc(eventRef, updatedEvent);

    console.log(`Event ${id} dropped successfully in Firestore.`);
    // Optionally refresh events or UI elements if needed
    // calendarRef.value?.getApi().refetchEvents(); // Uncomment if a full refresh is desired
  } catch (error) {
    console.error("Error updating event position in Firestore:", error);
    // Optionally revert the change in the calendar UI
    eventDropInfo.revert();
    alert("Failed to update event position. Please try again.");
  }
}
</script>

<!--Template-------->

<template>
  <div class="calendar-container">
    <!-- Custom navigation controls -->
    <div class="calendar-navigation">
      <v-btn icon size="small" class="nav-button" @click="goToPrev">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="custom-icon">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </v-btn>
      <v-btn icon size="small" class="nav-button" @click="goToNext">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="custom-icon">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </v-btn>
    </div>

    <!-- Updated view selector with white border -->
    <div class="calendar-header">
      <v-menu :close-on-content-click="true" location="bottom">
        <template v-slot:activator="{ props }">
          <div class="view-selector-container" v-bind="props">
            <div class="view-selector-display">
              {{viewOptions.find(v => v.value === currentView).title}}
              <v-icon size="small" color="white" class="ms-1">mdi-chevron-down</v-icon>
            </div>
          </div>
        </template>
        <v-list class="view-selector-menu" density="compact">
          <v-list-item v-for="option in filteredViewOptions" :key="option.value"
            @click="changeCalendarView(option.value)">
            <v-list-item-title>{{ option.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <FullCalendar class="full-calendar v-elevation-25" ref="calendarRef" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div class="event-content">
          <div class="event-content-inner">
            <div class="event-title">{{ arg.event.title }}</div>
            <div v-if="arg.event.extendedProps.turn" class="event-turn">
              <v-icon size="small" color="white" class="turn-icon">mdi-refresh</v-icon>
            </div>
          </div>
        </div>
      </template>
    </FullCalendar>

    <!-- Replace both modals with the new EventModal -->
    <EventModal v-model:visible="isEventModalVisible" :event="selectedEvent" :houses="userStore.userData?.houses || []"
      :event-start-date="eventStartDate" :event-end-date="eventEndDate" @close="closeEventModal"
      @create="handleCreateEvent" @update="handleEventUpdate" @delete="deleteEvent" />

    <!-- Time picker dialogs remain the same -->
    <TimePicker v-model="turncheckintime" v-model:isVisible="checkInTimeDialog" />
    <TimePicker v-model="turncheckouttime" v-model:isVisible="checkOutTimeDialog" />
  </div>
</template>

<!--Style----------->

<style>
/* Add these styles at the root level (remove scoped) */
/* Disable all Vuetify transitions globally */
.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active,
.v-menu-transition-enter-active,
.v-menu-transition-leave-active,
.v-date-picker-transition-enter-active,
.v-date-picker-transition-leave-active,
.v-overlay-transition-enter-active,
.v-overlay-transition-leave-active {
  transition: none !important;
}

/* Disable all animations */
.v-enter-active,
.v-leave-active,
.v-enter-from,
.v-leave-to {
  transition: none !important;
  animation: none !important;
}

/* Force disable transitions on all elements */
* {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable Vuetify menu animations */
.v-menu__content {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable date picker animations */
.v-date-picker {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable dialog animations */
.v-dialog {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable overlay animations */
.v-overlay {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable form field animations */
.v-field,
.v-field__field,
.v-field__input,
.v-field__outline,
.v-field__prepend-inner,
.v-field__append-inner {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable checkbox animations */
.v-checkbox,
.v-selection-control,
.v-selection-control__input {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable menu animations */
.v-menu,
.v-list,
.v-list-item {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable calendar animations */
.fc-view-harness,
.fc-scrollgrid,
.fc-scroller,
.fc-scroller-liquid-absolute {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Disable event animations */
.fc-event,
.fc-event-main,
.fc-event-time,
.fc-event-title {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Remove all transform effects */
.v-overlay__content,
.v-dialog .v-card,
.v-field__field {
  transform: none !important;
}

/* Disable hardware acceleration */
.v-overlay__content,
.v-dialog .v-card,
.v-field__field,
.v-menu__content,
.v-date-picker {
  backface-visibility: visible !important;
  -webkit-backface-visibility: visible !important;
  will-change: auto !important;
}

/* Ensure no smooth ing */
.modal-content-bg {
  scroll-behavior: auto !important;
}

/* Remove all transition classes */
.dialog-fade-enter-active,
.dialog-fade-leave-active,
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Add these styles for calendar events */
:deep(.fc-event) {
  border: none !important;
  background-color: var(--event-color, var(--primary-color)) !important;
}

:deep(.fc-daygrid-event) {
  padding: 2px 4px !important;
  border-radius: 4px !important;
  margin-top: 2px !important;
  margin-bottom: 2px !important;
  border: none !important;
  background-color: var(--event-color, var(--primary-color)) !important;
}

:deep(.fc-daygrid-event-harness) {
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}

:deep(.fc-event-main) {
  padding: 0 !important;
  color: white !important;
}

:deep(.fc-event-title) {
  padding: 0 !important;
  font-weight: 500 !important;
  color: white !important;
}

:deep(.fc-event-time) {
  display: none !important;
}

/* Update the event content styles */
.event-content {
  padding: 1px 3px !important;
  min-height: 16px !important;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.event-content-inner {
  padding: 0px 2px !important;
  min-height: 14px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.event-title {
  font-size: 0.85rem !important;
  line-height: 1.3 !important;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  padding-right: 4px;
  text-transform: uppercase;
  color: white !important;
}

/* Update the turn icon styles */
.event-turn {
  width: 18px !important;
  height: 18px !important;
  margin-top: 0 !important;
  padding: 1px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 3px;
}

.turn-icon {
  font-size: 14px !important;
  margin: 0;
  color: white !important;
}
</style>

<style scoped>

  

.calendar-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--success-color) 100%);
  color: white;
  padding: 0px;

  margin-bottom: 0px;
}

.calendar-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.calendar-btn {
  background: rgba(65, 105, 226, 0.1);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-btn:hover {
  background: var(--primary-color);
  color: white;
}

.calendar-btn.active {
  background: var(--primary-color);
  color: white;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.event-dot.primary {
  background-color: var(--primary-color);
}

.event-dot.secondary {
  background-color: var(--secondary-color);
}

.event-dot.accent {
  background-color: var(--accent-color);
}

.event-dot.error {
  background-color: var(--error-color);
}

.event-dot.success {
  background-color: var(--success-color);
}

.fc-event {
  border: none !important;
  padding: 4px 8px !important;
  margin: 2px 0 !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

.fc-event:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fc-event.primary {
  background-color: var(--primary-color) !important;
}

.fc-event.secondary {
  background-color: var(--secondary-color) !important;
}

.fc-event.accent {
  background-color: var(--accent-color) !important;
}

.fc-event.error {
  background-color: var(--error-color) !important;
}

.fc-event.success {
  background-color: var(--success-color) !important;
}

.fc-toolbar-title {
  color: var(--dark-color) !important;
  font-weight: 600 !important;
}

.fc-button-primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.fc-button-primary:hover {
  background-color: var(--success-color) !important;
  border-color: var(--success-color) !important;
}

.fc-day-today {
  background-color: rgba(244, 197, 48, 0.1) !important;
}

.fc-daygrid-day-number {
  color: var(--dark-color) !important;
}

.fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
  background-color: var(--accent-color) !important;
  color: white !important;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Keep only the essential styles here, remove all transitions and animations */
.calendar-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.calendar-header {
  position: absolute;
  top: 8px;
  right: 24px;
  z-index: 10;
}

.view-selector {
  background-color: var(--primary-color);
  border-radius: 4px;
}

.view-selector :deep(.v-field__append-inner) {
  color: white !important;
}

.view-selector :deep(.v-field__input) {
  color: white !important;
  font-weight: 500;
}

.view-selector :deep(.v-field) {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.view-select-menu .v-list-item--active) {
  background-color: rgba(94, 145, 193, 0.2);
}

.full-calendar {
  flex: 1;
  /* Take all available space */
  width: 100%;
  max-width: none !important;
  /* Override any max-width constraints */
}

/* Make the calendar fill the container with rounded corners */
:deep(.fc) {
  height: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  width: 100% !important;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  /* Enhanced shadow for elevation effect */
  background-color: white !important;
  /* Make calendar background white */
}

/* Style the day numbers to be centered, black and smaller */
:deep(.fc-daygrid-day-number) {
  width: 100%;
  text-align: center;
  font-size: 0.9rem !important;
  color: black !important;
  padding-top: 5px;
  font-weight: 500;
}

/* Center the day numbers in the header */
:deep(.fc-daygrid-day-top) {
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
}

/* Ensure day cells have proper styling */
:deep(.fc-daygrid-day) {
  background-color: white;
}

/* Style the header toolbar with centered title and adjusted navigation */
:deep(.fc .fc-toolbar.fc-header-toolbar) {
  margin-bottom: 1em;
  background: linear-gradient(0deg, var(--primary-color) 0%, var(--success-color) 80%);
  color: white;
  padding: 8px 8px 20px 8px;
  /* Increased bottom padding by 12px */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  justify-content: center;
  position: relative;

}

/* Center the title text */
:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  color: white;
  width: 100%;
  position: relative;
  left: 0;
}

/* Move navigation buttons to the left and make them smaller */
:deep(.fc-toolbar-chunk:first-child) {
  margin-left: 10px;
  display: flex;
  gap: 5px;
}

/* Style navigation buttons to be smaller */
:deep(.fc-prev-button),
:deep(.fc-next-button) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
}

:deep(.fc-prev-button .fc-icon),
:deep(.fc-next-button .fc-icon) {
  font-size: 0.9em !important;
}

:deep(.fc-prev-button:hover),
:deep(.fc-next-button:hover) {
  background-color: rgba(255, 255, 255, 0.3) !important;
}

/* Style the bottom of the calendar to ensure rounded corners */
:deep(.fc-view-harness) {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  overflow: hidden;
}

/* Keep the existing button styling */
:deep(.fc .fc-button-primary) {
  background-color: var(--primary-color);
  color: var(--fc-button-text-color);
}

:deep(.fc .fc-button) {
  background-color: var(--primary-color);
  border: 1px solid transparent;
  border-radius: 0.25em;
  font-size: 1em;
  font-weight: 400;
  line-height: 1.5;
  padding: 0.4em 0.65em;
}

/* Event styling */
:deep(.fc-daygrid-event) {
  border-radius: 5px;
  font-size: var(--fc-small-font-size);
  position: relative;
  white-space: nowrap;
}

/* Style today's date differently */
:deep(.fc-day-today) {
  background-color: rgba(234, 249, 252, 0.3) !important;
}

/* Custom view selector with white border */
.view-selector-container {
  border: 2px solid white;
  border-radius: 4px;
  cursor: pointer;
}

.view-selector-display {
  background-color: var(--primary-color);
  color: white;
  padding: 6px 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.view-selector-menu {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Update navigation button positioning for different screen sizes */
.calendar-navigation {
  position: absolute;
  top: 10px;
  left: 120px;
  display: flex;
  gap: 10px;
  z-index: 5;
  transition: all 0.3s ease;
}

.nav-button {
  background-color: var(--primary-color) !important;
  color: white !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
  border: none !important;
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  padding: 0 !important;
}

.nav-button:hover {
  background-color: var(--primary-darken-1) !important;
  transform: scale(1.05);
}

.custom-icon {
  width: 20px;
  height: 20px;
  color: white;
  stroke: white;
}

/* Mobile screens - adjusted to align with sidebar toggle */
@media (max-width: 768px) {
  .calendar-navigation {
    left: 50px;
    /* Position to the right of the sidebar toggle */
  }

  .nav-button {
    width: 32px;
    height: 32px;
  }

  .custom-icon {
    width: 18px;
    height: 18px;
  }
}

/* Adjustments for very small screens */
@media (max-width: 480px) {
  .calendar-navigation {
    left: 50px;
    gap: 5px;
  }

  .nav-button {
    width: 32px !important;
    height: 32px !important;
  }

  .custom-icon {
    width: 18px !important;
    height: 18px !important;
  }
}

/* Hide the default navigation buttons */
:deep(.fc-toolbar-chunk:first-child),
:deep(.fc-prev-button),
:deep(.fc-next-button) {
  display: none;
}

/* Remove selector styles that will be replaced by the custom ones */
.view-selector {
  display: none;
}

/* Style for day cells with turns */
:deep(.has-turn-day) {
  position: relative;
  z-index: 1;
  background-color: transparent !important;
  /* Reset the background color */
}

/* Add a pseudo-element to create the partial yellow background */
:deep(.has-turn-day::after) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 33%;
  /* Just one-third of the vertical space */
  background-color: rgba(244, 197, 48, 0.3);
  /* Light yellow with transparency - slightly more visible */
  z-index: -1;
  /* Place behind content */
  pointer-events: none;
  /* Allow clicking through */
  border-bottom: 1px dashed rgba(244, 152, 0, 0.3);
  /* Add a subtle border to clearly define the area */
}

/* Make sure the day number remains visible over the yellow background */
:deep(.has-turn-day .fc-daygrid-day-number) {
  color: rgba(0, 0, 0, 0.9) !important;
  font-weight: 500;
}

/* Add a more visible indicator */
:deep(.has-turn-day::before) {
  content: "";
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(244, 197, 48, 0.7);
  /* More visible orange color */
  z-index: 2;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Ensure compatibility with today's date highlight */
:deep(.fc-day-today.has-turn-day::after) {
  background-color: rgba(244, 197, 48, 0.4);
  /* Slightly more opaque for today */
  border-bottom: 1px dashed rgba(244, 152, 0, 0.5);
  /* More visible border for today */
}

/* Adjustments for different views */
/* Month view - already covered by the default styles */

/* Week view */
:deep(.fc-timeGridWeek-view .has-turn-day::after) {
  height: 20px;
  /* Fixed height instead of percentage for time grid */
}

/* Day view */
:deep(.fc-timeGridDay-view .has-turn-day::after) {
  height: 20px;
  /* Fixed height instead of percentage for time grid */
}

/* Ensure the dot indicator is visible across all views */
:deep(.fc-timeGridWeek-view .has-turn-day::before),
:deep(.fc-timeGridDay-view .has-turn-day::before) {
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
}

/* Make events 25% smaller in height */
:deep(.fc-daygrid-event-harness) {
  margin-top: 1px !important;
  margin-bottom: 1px !important;
}

:deep(.fc-daygrid-event) {
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  min-height: 18px !important;
  /* Reduce the minimum height */
}

/* Adjust events height - make 10% taller than current size */
:deep(.fc-daygrid-event-harness) {
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}

:deep(.fc-daygrid-event) {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  min-height: 20px !important;
  /* Increase from 18px to 20px */
}

.event-content {
  padding: 2px 3px !important;
  min-height: 18px !important;
  /* Increase from 16px to 18px */
}

.event-content-inner {
  padding: 1px 2px !important;
  min-height: 16px !important;
  /* Increase from 14px to 16px */
}

.event-title {
  font-size: 0.95rem !important;
  /* Slightly larger font */
  line-height: 1 !important;
}

/* Adjust the turn icon size */
.event-turn {
  width: 20px !important;
  /* Increase from 18px to 20px */
  height: 20px !important;
  margin-top: 0 !important;
  padding: 1px !important;
}

.turn-icon {
  font-size: 15px !important;
  /* Slightly larger icon */
}
</style>
