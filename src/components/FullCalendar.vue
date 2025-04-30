<script setup lang="ts">
// Imports
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventResizeDoneArg, EventDropArg } from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg, EventSourceFuncArg } from "@fullcalendar/core/index.js";
import { CalendarApi } from '@fullcalendar/core';
import { defineProps, PropType, defineEmits } from "vue";
import { useUserStore } from "../stores/userStore";
import { useHouseStore } from "../stores/houseStore";
import { useEventStore } from "../stores/eventStore";
import debounce from 'lodash/debounce';
import { onMounted, ref, onBeforeUnmount, watch, computed } from "vue";
import { Event } from "../stores/eventStore";


// Interface for EventModalData
interface EventModalData {
  startDate: string;
  endDate: string;
  event: Event | null;
}

// Define emits
const emit = defineEmits([
    'open-event-modal',
    'create-event',
    'update-event',
    'delete-event'
]);

// Use stores
const userStore = useUserStore();
const houseStore = useHouseStore();
const eventStore = useEventStore();

// Component state
const calendarRef = ref<{ getApi: () => CalendarApi } | null>(null);
const calendarHeight = ref<number>(window.innerHeight - 20);

// Props
const props = defineProps({
    userId: { type: String as PropType<string>, required: true },
    view: { type: String as PropType<string>, default: 'month' }
});

// Map external view values to internal FullCalendar view values
const viewMap: Record<string, string> = {
    'month': 'dayGridMonth',
    'week': 'timeGridWeek',
    'day': 'timeGridDay'
};

// Computed current view based on prop
const currentView = computed(() => {
    return viewMap[props.view] || 'dayGridMonth';
});

// Calendar configuration
const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
        left: "",
        center: "title",
        right: "",
    },
    initialView: currentView.value,
    height: calendarHeight.value,
    eventDidMount: (info: any) => {
        info.el.style.setProperty('--event-color', info.event.extendedProps.color || '#2979ff');
        info.el.style.backgroundColor = info.event.extendedProps.color || '#2979ff';
        info.el.style.opacity = '1';
    },
    dayCellDidMount: (arg: any) => {
        const cellDate = arg.date.toISOString().split('T')[0];
        const api = calendarRef.value?.getApi();
        const events = api ? api.getEvents() : [];

        const hasTurnOnDay = events.some(event =>
            event.extendedProps?.turn === true &&
            event.extendedProps?.turndate === cellDate
        );

        if (hasTurnOnDay) {
            arg.el.classList.add('has-turn-day');
        }
    },
    datesSet: () => {
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

// Watch for changes in the view prop
watch(() => props.view, (newView) => {
    if (newView && viewMap[newView] && calendarRef.value?.getApi()) {
        calendarRef.value.getApi().changeView(viewMap[newView]);
    }
});

// Handle window resize with debounce
const handleResize = debounce((): void => {
    calendarHeight.value = window.innerHeight - 20;
    if (calendarRef.value?.getApi()) {
        calendarRef.value.getApi().setOption('height', calendarHeight.value);
    }
}, 100);

// Refresh turn highlights with debounce
const debouncedRefreshHighlights = debounce(refreshTurnDayHighlights, 100);

onMounted(() => {
    window.addEventListener('resize', handleResize);

    // Wait for calendar to be ready and then refresh highlights
    const checkCalendarReady = setInterval(() => {
        if (calendarRef.value?.getApi()) {
            clearInterval(checkCalendarReady);
            setTimeout(refreshTurnDayHighlights, 300);
        }
    }, 100);

    handleResize();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

// Function to fetch events from the store
async function fetchEvents(fetchInfo: EventSourceFuncArg, successCallback: (events: Event[]) => void, failureCallback: (error: Error) => void): Promise<void> {
    try {
        const events = await eventStore.fetchEvents(fetchInfo.startStr, fetchInfo.endStr);
        successCallback(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        failureCallback(error as Error);
    }
}

// Handle date selection
function handleDateSelect(selectInfo: DateSelectArg): void {
    const startDate = selectInfo.startStr.split('T')[0];
    const endDate = selectInfo.endStr.split('T')[0];

    emit('open-event-modal', {
        startDate,
        endDate,
        event: null
    });

    // Clear selection
    if (calendarRef.value?.getApi()) {
        calendarRef.value.getApi().unselect();
    }
}

// Function to refresh turn day highlights
function refreshTurnDayHighlights(): void {
    if (!calendarRef.value?.getApi()) return;

    // Remove existing turn day highlights
    document.querySelectorAll('.has-turn-day').forEach(el => {
        el.classList.remove('has-turn-day');
    });

    // Get all turn events
    const events = calendarRef.value.getApi().getEvents();
    const turnEvents = events.filter(event =>
        event.extendedProps?.turn === true &&
        event.extendedProps?.turndate
    );

    // Add highlight to cells with turn events
    turnEvents.forEach(event => {
        const turnDate = event.extendedProps?.turndate;
        const dateCell = document.querySelector(`.fc-day[data-date="${turnDate}"]`);
        if (dateCell) {
            dateCell.classList.add('has-turn-day');
        }
    });
}

// Edit event
function editEvent(clickInfo: EventClickArg): void {
    const event = clickInfo.event;

    emit('open-event-modal', {
        startDate: event.startStr.split('T')[0],
        endDate: event.endStr.split('T')[0],
        event: {
            id: event.id,
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            extendedProps: event.extendedProps
        }
    });
}

// Handle event resize
async function handleEventResize(eventResizeInfo: EventResizeDoneArg): Promise<void> {
    const event = eventResizeInfo.event;

    try {
        await eventStore.updateEvent({
            id: event.id,
            start: event.startStr,
            end: event.endStr,
        });
    } catch (error) {
        console.error("Error resizing event:", error);
        eventResizeInfo.revert();
    }
}

// Handle event drop
async function handleEventDrop(eventDropInfo: EventDropArg): Promise<void> {
    const event = eventDropInfo.event;

    try {
        await eventStore.updateEvent({
            id: event.id,
            start: event.startStr,
            end: event.endStr,
        });
    } catch (error) {
        console.error("Error dropping event:", error);
        eventDropInfo.revert();
    }
}

// Calendar navigation helpers
function goToPrev(): void {
    if (calendarRef.value?.getApi()) {
        calendarRef.value.getApi().prev();
    }
}

function goToNext(): void {
    if (calendarRef.value?.getApi()) {
        calendarRef.value.getApi().next();
    }
}
</script>

<template>
    <div class="calendar-container">
        <div class="header">
            <div class="calendar-nav">
                <v-btn icon size="small" @click="goToPrev">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn icon size="small" @click="goToNext">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </div>
        </div>

        <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
</template>

<style scoped>
.calendar-container {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
}

.calendar-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

:deep(.has-turn-day) {
    position: relative;
}

:deep(.has-turn-day):after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ff5722;
}

:deep(.fc-h-event) {
    background-color: var(--event-color, #2979ff);
    border: none;
    border-radius: 4px;
    margin: 1px 0;
}
</style>