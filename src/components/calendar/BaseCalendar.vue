<script setup lang="ts">
import type { CalendarEvent, CalendarViewType } from '~/models/calendar'
import { useCalendar } from '~/composables/useCalendar'

interface Props {
    initialView?: CalendarViewType
    events?: CalendarEvent[]
    editable?: boolean
    selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    initialView: 'dayGridMonth',
    events: () => [],
    editable: true,
    selectable: true
})

const emit = defineEmits<{
    (e: 'update:events', events: CalendarEvent[]): void
    (e: 'select-date', date: Date): void
    (e: 'select-event', event: CalendarEvent): void
}>()

// Initialize calendar composable
const {
    currentView,
    events: calendarEvents,
    selectedDate,
    timeSlots,
    changeView,
    addEvent,
    updateEvent,
    deleteEvent,
    selectDate
} = useCalendar({
    initialView: props.initialView,
    editable: props.editable,
    selectable: props.selectable
})

// Watch for external events changes
watch(() => props.events, (newEvents) => {
    calendarEvents.value = newEvents
}, { immediate: true })

// Watch for internal events changes
watch(calendarEvents, (newEvents) => {
    emit('update:events', newEvents)
}, { deep: true })

// Watch for date selection
watch(selectedDate, (date) => {
    if (date) {
        emit('select-date', date)
    }
})

// Methods
const handleEventClick = (event: CalendarEvent) => {
    emit('select-event', event)
}

const handleDateSelect = (date: Date) => {
    selectDate(date)
}
</script>

<template>
    <div class="calendar-container">
        <!-- Calendar Header -->
        <div class="calendar-header">
            <div class="view-options">
                <button v-for="view in ['dayGridMonth', 'timeGridWeek', 'timeGridDay']" :key="view"
                    :class="{ active: currentView === view }" @click="changeView(view as CalendarViewType)">
                    {{ view }}
                </button>
            </div>
        </div>

        <!-- Calendar Body -->
        <div class="calendar-body">
            <!-- Calendar grid implementation will go here -->
            <!-- This is a placeholder for the actual calendar implementation -->
            <div class="calendar-grid">
                <!-- Calendar grid content -->
            </div>
        </div>

        <!-- Calendar Footer -->
        <div class="calendar-footer">
            <div v-if="selectedDate" class="selected-date">
                Selected: {{ selectedDate.toLocaleDateString() }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.calendar-container {
    @apply w-full h-full flex flex-col;
}

.calendar-header {
    @apply p-4 border-b border-gray-200;
}

.view-options {
    @apply flex gap-2;
}

.view-options button {
    @apply px-4 py-2 rounded-md transition-colors;
}

.view-options button.active {
    @apply bg-primary-500 text-white;
}

.calendar-body {
    @apply flex-1 p-4;
}

.calendar-grid {
    @apply w-full h-full;
}

.calendar-footer {
    @apply p-4 border-t border-gray-200;
}

.selected-date {
    @apply text-sm text-gray-600;
}
</style>