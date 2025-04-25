<!--Script---------->

<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { auth } from "@/auth";
import { db } from "@/firebaseConfig";
import { useUserStore } from "@/stores/userStore";
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
import TimePicker from "@/components/ui/TimePicker.vue";
import { useTimeManagement } from "@/composables/useTimeManagement";
import type { CalendarEvent, CalendarProps, CalendarEmits, CalendarOptions, CalendarViewOption } from "@/types/calendar";

// Props and Emits
const props = defineProps<CalendarProps>();
const emit = defineEmits<CalendarEmits>();

// Refs
const isEventModalVisible = ref<boolean>(false);
const isEditMode = ref<boolean>(false);
const selectedEventId = ref<string | null>(null);
const selectedEvent = ref<CalendarEvent | null>(null);
const eventStartDate = ref<string>("");
const eventEndDate = ref<string>("");
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const calendarHeight = ref<number>(window.innerHeight - 20);
const selectedHouse = ref<any>(null);
const currentView = ref<string>('dayGridMonth');

// Store and composables
const userStore = useUserStore();
const {
    checkInTimeDialog,
    checkOutTimeDialog,
    turncheckintime,
    turncheckouttime,
    updateCheckInTime,
    updateCheckOutTime
} = useTimeManagement();

// Constants
const viewOptions: CalendarViewOption[] = [
    { title: 'Month', value: 'dayGridMonth' },
    { title: 'Week', value: 'timeGridWeek' },
    { title: 'Day', value: 'timeGridDay' }
];

const viewMap: Record<string, string> = {
    'month': 'dayGridMonth',
    'week': 'timeGridWeek',
    'day': 'timeGridDay'
};

// Watch for view changes
watch(() => props.view, (newView) => {
    if (newView && viewMap[newView]) {
        changeCalendarView(viewMap[newView]);
    }
});

// Methods
const changeCalendarView = (view: string): void => {
    if (calendarRef.value && calendarRef.value.getApi) {
        calendarRef.value.getApi().changeView(view);
        currentView.value = view;
    }
};

const handleResize = (): void => {
    calendarHeight.value = window.innerHeight - 20;
    if (calendarRef.value && calendarRef.value.getApi) {
        calendarRef.value.getApi().setOption('height', calendarHeight.value);
    }
};

const closeEventModal = (): void => {
    isEventModalVisible.value = false;
    isEditMode.value = false;
    selectedEvent.value = null;
    selectedEventId.value = null;
};

const fetchEvents = async (
    fetchInfo: any,
    successCallback: (events: CalendarEvent[]) => void,
    failureCallback: (error: Error) => void
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

const handleDateSelect = (selectInfo: any): void => {
    const selectedDate = selectInfo.startStr.split("T")[0];
    eventStartDate.value = selectedDate;
    eventEndDate.value = selectedDate;
    selectedEvent.value = null;

    emit('openEventModal', {
        startDate: selectedDate,
        endDate: selectedDate,
        event: null
    });
};

const editEvent = (clickInfo: any): void => {
    const event = clickInfo.event;
    selectedEventId.value = event.id;

    const eventData = event.toPlainObject({ collapseExtendedProps: true });
    selectedEvent.value = {
        id: event.id,
        title: event.title,
        start: event.startStr,
        end: event.endStr,
        ...eventData.extendedProps
    } as CalendarEvent;

    eventStartDate.value = formatDateForPicker(event.start);
    eventEndDate.value = event.end ? formatDateForPicker(event.end) : eventStartDate.value;

    emit('openEventModal', {
        startDate: eventStartDate.value,
        endDate: eventEndDate.value,
        event: selectedEvent.value
    });
};

const handleEventResize = async (eventResizeInfo: any): Promise<void> => {
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
};

const handleEventDrop = async (eventDropInfo: any): Promise<void> => {
    try {
        const { id, start, end } = eventDropInfo.event;

        const updatedEvent = {
            start: start ? start.toISOString() : null,
            end: end ? end.toISOString() : null,
        };

        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, updatedEvent);

        console.log(`Event ${id} dropped successfully in Firestore.`);
    } catch (error) {
        console.error("Error updating event position in Firestore:", error);
        eventDropInfo.revert();
        alert("Failed to update event position. Please try again.");
    }
};

const refreshTurnDayHighlights = (): void => {
    const api = calendarRef.value?.getApi();
    if (!api) return;

    requestAnimationFrame(() => {
        const events = api.getEvents();
        const turnDates = events
            .filter(event => event.extendedProps?.turn === true && event.extendedProps?.turndate)
            .map(event => event.extendedProps.turndate);

        const turnDatesSet = new Set(turnDates);
        const cells = Array.from(document.querySelectorAll('.fc-daygrid-day'));
        const toAdd: Element[] = [];
        const toRemove: Element[] = [];

        cells.forEach(cell => {
            const cellDate = cell.getAttribute('data-date');
            const shouldHaveClass = cellDate ? turnDatesSet.has(cellDate) : false;
            const hasClass = cell.classList.contains('has-turn-day');

            if (shouldHaveClass && !hasClass) {
                toAdd.push(cell);
            } else if (!shouldHaveClass && hasClass) {
                toRemove.push(cell);
            }
        });

        if (toAdd.length > 0 || toRemove.length > 0) {
            requestAnimationFrame(() => {
                toAdd.forEach(cell => cell.classList.add('has-turn-day'));
                toRemove.forEach(cell => cell.classList.remove('has-turn-day'));
            });
        }
    });
};

const debouncedRefreshHighlights = debounce(() => {
    refreshTurnDayHighlights();
}, 200);

const goToPrev = (): void => {
    if (calendarRef.value?.getApi()) {
        calendarRef.value.getApi().prev();
    }
};

const goToNext = (): void => {
    if (calendarRef.value?.getApi()) {
        calendarRef.value.getApi().next();
    }
};

// Calendar options
const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
        left: "",
        center: "title",
        right: "",
    },
    initialView: "dayGridMonth",
    height: calendarHeight.value,
    eventDidMount: (info: { el: HTMLElement; event: { extendedProps: { color?: string } } }) => {
        info.el.style.setProperty('--event-color', info.event.extendedProps.color || '#2979ff');
        info.el.style.backgroundColor = info.event.extendedProps.color || '#2979ff';
        info.el.style.opacity = '1';
    },
    dayCellDidMount: (arg: { date: Date; el: HTMLElement }) => {
        const cellDate = arg.date.toISOString().split('T')[0];
        const api = calendarRef.value?.getApi();
        const events = api ? api.getEvents() : [];

        const hasTurnOnDay = events.some(event => {
            return event.extendedProps?.turn === true &&
                event.extendedProps?.turndate === cellDate;
        });

        if (hasTurnOnDay) {
            arg.el.classList.add('has-turn-day');
        }
    },
    datesSet: (dateInfo: { start: Date; end: Date }) => {
        if (calendarRef.value?.getApi()) {
            calendarRef.value.getApi().refetchEvents();
            debouncedRefreshHighlights();
        }
    },
    selectable: true,
    select: handleDateSelect,
    eventClick: editEvent,
    events: fetchEvents,
    eventResize: handleEventResize,
    editable: true,
    eventDrop: handleEventDrop,
    dayMaxEventRows: true,
    lazyFetching: true,
    rerenderDelay: 50,
};

// Lifecycle hooks
onMounted(() => {
    window.addEventListener('resize', handleResize);

    const checkCalendarReady = setInterval(() => {
        if (calendarRef.value?.getApi()) {
            clearInterval(checkCalendarReady);

            setTimeout(() => {
                refreshTurnDayHighlights();
            }, 300);
        }
    }, 100);

    handleResize();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

// Watch for selectedHouseId changes
watch(() => props.selectedHouseId, (newHouseId) => {
    if (newHouseId && userStore.userData?.houses) {
        const house = userStore.userData.houses.find((h: { houseId: string }) => h.houseId === newHouseId);
        if (house) {
            selectedHouse.value = house;
        }
    } else {
        selectedHouse.value = null;
    }
}, { immediate: true });

// Utility function for date formatting
const formatDateForPicker = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Computed
const filteredViewOptions = computed<CalendarViewOption[]>(() => {
    return viewOptions;
});
</script>

<!--Template-------->

<template>
    <div class="calendar-container">
        <!-- Custom navigation controls -->
        <div class="calendar-navigation">
            <v-btn icon size="small" class="nav-button" @click="goToPrev">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                    class="custom-icon">
                    <path fill="white" stroke="white" d="M15 4l-8 8 8 8"></path>
                </svg>
            </v-btn>
            <v-btn icon size="small" class="nav-button" @click="goToNext">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                    class="custom-icon">
                    <path fill="white" stroke="white" d="M9 4l8 8-8 8"></path>
                </svg>
            </v-btn>
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

        <TimePicker v-model="turncheckintime" v-model:isVisible="checkInTimeDialog" />
        <TimePicker v-model="turncheckouttime" v-model:isVisible="checkOutTimeDialog" />
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
    color: inherit;
}

:deep(.fc-event-main) {
    color: white !important;
}

:deep(.fc-event-title) {
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
</style>