<!--Script---------->

<script setup lang="ts">
//imports
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { defineProps, nextTick } from "vue";
import { auth } from "../auth";
import { db } from "../firebaseConfig";
import { useUserStore } from "../stores/userStore";
import {
  collection,
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
// import EventModal from './EventModal.vue';

import type {
  CalendarEvent,
  CalendarProps,
  CalendarEmits,
  CalendarOptions,
  CalendarViewOption,
  EventInfo,
  CalendarEventSource,
  CalendarEventSourceSuccessHandler,
  CalendarEventSourceErrorHandler
} from '../types/calendar';
import type { DateSelectArg, EventClickArg, EventInput, EventMountArg } from '@fullcalendar/core';
import type { EventResizeDoneArg, EventDragStopArg } from '@fullcalendar/interaction';

interface House {
  userId: string;
  houseId: string;
  address: string;
  color: string;
  selected?: boolean;
  contactnumber?: string;
}

const userStore = useUserStore();
// Replace these refs
const isEventModalVisible = ref<boolean>(false);
const isEditMode = ref<boolean>(false);
const selectedEventId = ref<string | null>(null);
const selectedEvent = ref<CalendarEvent | null>(null);
const eventStartDate = ref<string>("");
const eventEndDate = ref<string>("");
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const calendarHeight = ref<number>(window.innerHeight - 20); // Set initial height minus some padding
const selectedHouse = ref<House | null>(null);

// Use the time management composable
const {
  checkInTimeDialog,
  checkOutTimeDialog,
  turncheckintime,
  turncheckouttime,
  updateCheckInTime,
  updateCheckOutTime
} = useTimeManagement();

const props = defineProps<CalendarProps>();
const emit = defineEmits<CalendarEmits>();

const viewOptions: CalendarViewOption[] = [
  { title: 'Month', value: 'dayGridMonth' },
  { title: 'Week', value: 'timeGridWeek' },
  { title: 'Day', value: 'timeGridDay' }
];

const currentView = ref<string>('dayGridMonth');

// Map external view values to internal FullCalendar view values
const viewMap: Record<string, string> = {
  'month': 'dayGridMonth',
  'week': 'timeGridWeek',
  'day': 'timeGridDay'
};

// Watch for changes in the view prop and update calendar view
watch(() => props.view, (newView) => {
  if (newView && viewMap[newView]) {
    changeCalendarView(viewMap[newView]);
  }
});

const changeCalendarView = (view: string): void => {
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().changeView(view);
    currentView.value = view;
  }
};

const fetchEvents = async (
  fetchInfo: { start: Date; end: Date; timeZone: string },
  successCallback: CalendarEventSourceSuccessHandler,
  failureCallback: CalendarEventSourceErrorHandler
): Promise<void> => {
  try {
    const q = query(
      collection(db, "events"),
      where("userId", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CalendarEvent[];
    successCallback(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    failureCallback(error as Error);
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
  eventDidMount: (info: EventMountArg) => {
    // Set the event color as a CSS variable
    info.el.style.setProperty('--event-color', info.event.extendedProps.color || '#2979ff');
    info.el.style.backgroundColor = info.event.extendedProps.color || '#2979ff';
    info.el.style.opacity = '1';
  },
  dayCellDidMount: (arg: { el: HTMLElement; date: Date }) => {
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
  datesSet: (dateInfo: { start: Date; end: Date; startStr: string; endStr: string; timeZone: string }) => {
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
  events: fetchEvents as any, // Type assertion for events function
  eventResize: handleEventResize as any, // Type assertion for eventResize
  editable: true,
  eventDrop: handleEventDrop as any, // Type assertion for eventDrop
  dayMaxEventRows: true,
  lazyFetching: true,
  rerenderDelay: 50,
} as any; // Type assertion for calendarOptions

// Handle window resize to update calendar height
const handleResize = (): void => {
  calendarHeight.value = window.innerHeight - 20; // Subtract padding
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().setOption('height', calendarHeight.value);
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);

  // Set up a watcher for when the calendar is initialized
  const checkCalendarReady = setInterval(() => {
    if (calendarRef.value?.getApi()) {
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

const closeEventModal = (): void => {
  isEventModalVisible.value = false;
  isEditMode.value = false;
  selectedEvent.value = null;
  selectedEventId.value = null;
};

/**
 * EVENT DELEGATION ARCHITECTURE
 * 
 * Instead of handling modals and Firestore operations directly:
 * 1. This component emits events UP to the parent (Home.vue)
 * 2. Home.vue manages modal state and Firestore interactions via userStore
 * 3. This creates a cleaner separation of concerns:
 *    - FullCalendar: UI and user interactions
 *    - Home.vue: Modal/UI state management
 *    - userStore: Data persistence and business logic
 */
function handleDateSelect(selectInfo: DateSelectArg): void {
  const selectedDate = selectInfo.startStr.split("T")[0];
  eventStartDate.value = selectedDate;
  eventEndDate.value = selectedDate;
  selectedEvent.value = null;

  // Emit to parent instead of showing modal directly
  emit('openEventModal', {
    startDate: selectedDate,
    endDate: selectedDate,
    event: null
  });
}

// Function to refresh all day cells to show turn highlights
function refreshTurnDayHighlights(): void {
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

    // Minimize DOM operations by first collecting all elements needing changes
    const cells = Array.from(document.querySelectorAll('.fc-daygrid-day'));
    const toAdd: HTMLElement[] = [];
    const toRemove: HTMLElement[] = [];

    cells.forEach(cell => {
      const cellDate = cell.getAttribute('data-date');
      const shouldHaveClass = turnDatesSet.has(cellDate);
      const hasClass = cell.classList.contains('has-turn-day');

      if (shouldHaveClass && !hasClass) {
        toAdd.push(cell as HTMLElement);
      } else if (!shouldHaveClass && hasClass) {
        toRemove.push(cell as HTMLElement);
      }
    });

    // Batch DOM operations
    if (toAdd.length > 0 || toRemove.length > 0) {
      requestAnimationFrame(() => {
        toAdd.forEach(cell => cell.classList.add('has-turn-day'));
        toRemove.forEach(cell => cell.classList.remove('has-turn-day'));
      });
    }
  });
}

// Create a debounced version of refreshTurnDayHighlights
const debouncedRefreshHighlights = debounce(() => {
  refreshTurnDayHighlights();
}, 200);

// Event operations now delegated to parent via events
async function handleCreateEvent(eventData: CalendarEvent) {
  // Emit to parent instead of handling directly
  emit('createEvent', eventData);
}

function editEvent(clickInfo: EventClickArg): void {
  const event = clickInfo.event;
  selectedEventId.value = event.id;

  // Get the event data from the database to ensure we have full details
  const eventData = event.toPlainObject({ collapseExtendedProps: true });
  selectedEvent.value = {
    id: event.id,
    title: event.title,
    start: event.startStr,
    end: event.endStr,
    ...eventData.extendedProps
  } as CalendarEvent;

  // Format dates for the event modal
  eventStartDate.value = event.start ? formatDateForPicker(event.start) : '';
  eventEndDate.value = event.end ? formatDateForPicker(event.end) : eventStartDate.value;

  // Emit to parent instead of handling directly in component
  emit('openEventModal', {
    startDate: eventStartDate.value,
    endDate: eventEndDate.value,
    event: selectedEvent.value
  });
}

// Update the handleEventUpdate function to refresh day cells after updating an event
async function handleEventUpdate(updatedEvent: CalendarEvent) {
  // Emit to parent instead of handling directly
  emit('updateEvent', updatedEvent);
}

// Update deleteEvent
const deleteEvent = async (): Promise<void> => {
  // Emit to parent instead of handling directly
  emit('deleteEvent', selectedEventId.value!);
}

async function handleEventResize(resizeInfo: EventResizeDoneArg): Promise<void> {
  try {
    const { id, start, end } = resizeInfo.event;

    const updatedEvent: Partial<CalendarEvent> = {
      start: start ? start.toISOString() : undefined,
      end: end ? end.toISOString() : undefined
    };

    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, updatedEvent);

    console.log(`Event ${id} resized successfully in Firestore.`);
  } catch (error) {
    console.error("Error resizing event in Firestore:", error);
  }
}

// Add computed property to filter view options
const filteredViewOptions = computed<CalendarViewOption[]>(() => {
  return viewOptions;
});

// Function to navigate to previous month/week/day
const goToPrev = (): void => {
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().prev();
  }
};

// Function to navigate to next month/week/day
const goToNext = (): void => {
  if (calendarRef.value && calendarRef.value.getApi) {
    calendarRef.value.getApi().next();
  }
};

// Update the eventDrop handler function to use EventDragStopArg
async function handleEventDrop(dropInfo: EventDragStopArg): Promise<void> {
  try {
    const { id, start, end } = dropInfo.event;

    const updatedEvent: Partial<CalendarEvent> = {
      start: start ? start.toISOString() : undefined,
      end: end ? end.toISOString() : undefined
    };

    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, updatedEvent);

    console.log(`Event ${id} dropped successfully in Firestore.`);
  } catch (error) {
    console.error("Error updating event position in Firestore:", error);
    // Use type assertion for revert method
    (dropInfo as any).revert();
    alert("Failed to update event position. Please try again.");
  }
}

// Add the formatDateForPicker function with proper null handling
const formatDateForPicker = (date: Date | null): string => {
  if (!date) return '';
  const isoString = date.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart as string;
};
</script>

<!--Template-------->

<template>
  <div class="calendar-container">
    <!-- Custom navigation controls -->
    <div class="calendar-navigation">
      <v-btn icon size="small" class="nav-button" @click="goToPrev">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="custom-icon">
          <path fill="white" stroke="white" d="M15 4l-8 8 8 8"></path>
        </svg>
      </v-btn>
      <v-btn icon size="small" class="nav-button" @click="goToNext">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="custom-icon">
          <path fill="white" stroke="white" d="M9 4l8 8-8 8"></path>
        </svg>
      </v-btn>
    </div>

    <!-- Updated view selector with white border -->

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

    <!-- Time picker dialogs remain the same -->
    <TimePicker v-model="turncheckintime as unknown as string" v-model:isVisible="checkInTimeDialog" />
    <TimePicker v-model="turncheckouttime as unknown as string" v-model:isVisible="checkOutTimeDialog" />
  </div>
</template>

<!--Style----------->

<style>
/* Performance optimizations first */
.calendar-container {
  height: 100vh;
  contain: strict;
}

.full-calendar {
  content-visibility: auto;
  contain-intrinsic-size: 1000px;
}

:deep(.fc) {
  contain: content;
}

:deep(.fc-view-harness) {
  content-visibility: auto;
  contain-intrinsic-size: 800px;
}

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

/* Ensure no smooth scrolling */
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
  background-color: var(--event-color, var(--primary-color)) !important;
}

:deep(.fc-daygrid-event-harness) {
  /* Add color-related styling if needed, or remove this ruleset */
  color: inherit;
  /* Example placeholder */
}

:deep(.fc-event-main) {
  /* Keep only color-related styling */
  color: white !important;
}

:deep(.fc-event-title) {
  /* Keep only color-related styling */
  color: white !important;
}

:deep(.fc-event-time) {
  display: none !important;
}

/* Update the event content styles */
.event-content {
  width: 100%;
}

.event-content-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.event-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  color: white !important;
  text-transform: uppercase;
}

/* Update the turn icon styles */
.event-turn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.turn-icon {
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
  background-color: var(--event-color, var(--primary-color)) !important;
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
  background: #4169e2;
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
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;
  color: white !important;
  width: 100%;
  position: relative;
  left: 0;
  text-transform: uppercase;
  letter-spacing: .8px;
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
  background-color: var(--event-color, var(--primary-color)) !important;
}

/* Style today's date differently */
:deep(.fc-day-today) {
  background-color: rgba(234, 249, 252, 0.3) !important;
}

/* Custom view selector with white border */

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
}

/* Remove the yellow background and dot indicators by emptying these rules */
:deep(.has-turn-day::after) {
  display: none;
}

:deep(.has-turn-day .fc-daygrid-day-number) {
  /* Keep normal day number styling */
}

:deep(.has-turn-day::before) {
  display: none;
}

:deep(.fc-day-today.has-turn-day::after) {
  display: none;
}

:deep(.fc-timeGridWeek-view .has-turn-day::after) {
  display: none;
}

:deep(.fc-timeGridDay-view .has-turn-day::after) {
  display: none;
}

:deep(.fc-timeGridWeek-view .has-turn-day::before),
:deep(.fc-timeGridDay-view .has-turn-day::before) {
  display: none;
}
</style>
