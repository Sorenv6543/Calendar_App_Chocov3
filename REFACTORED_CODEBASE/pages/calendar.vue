<script setup lang="ts">
import { ref } from 'vue'
import type { EventInput } from '@fullcalendar/core'
import type { DateClickArg, EventClickArg, EventDropArg, EventResizeArg } from '@fullcalendar/core'

// Initial sample events
const events = ref<EventInput[]>([
  {
    id: '1',
    title: 'Meeting',
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    backgroundColor: '#4CAF50'
  },
  {
    id: '2',
    title: 'Appointment',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    backgroundColor: '#2196F3'
  }
])

const calendarView = ref('dayGridMonth')
const selectedEvent = ref<EventInput | null>(null)

const addEvent = (event: EventInput) => {
  events.value.push(event)
}

const updateEvent = (id: string, updatedProps: Partial<EventInput>) => {
  const index = events.value.findIndex(e => e.id === id)
  if (index !== -1) {
    events.value[index] = { ...events.value[index], ...updatedProps }
  }
}

const deleteEvent = (id: string) => {
  events.value = events.value.filter(e => e.id !== id)
  if (selectedEvent.value?.id === id) {
    selectedEvent.value = null
  }
}

const setSelectedEvent = (event: EventInput) => {
  selectedEvent.value = event
}

const setCalendarView = (view: string) => {
  calendarView.value = view
}

const handleEventClick = (info: EventClickArg) => {
  setSelectedEvent(info.event)
}

const handleDateClick = (info: DateClickArg) => {
  const newEvent: EventInput = {
    id: Date.now().toString(),
    title: 'New Event',
    start: info.dateStr,
    allDay: info.allDay,
    backgroundColor: '#FF9800'
  }
  addEvent(newEvent)
  setSelectedEvent(newEvent)
}

const handleEventDrop = (info: EventDropArg) => {
  updateEvent(info.event.id, {
    start: info.event.start,
    end: info.event.end
  })
}

const handleEventResize = (info: EventResizeArg) => {
  updateEvent(info.event.id, {
    start: info.event.start,
    end: info.event.end
  })
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Calendar</h1>
    
    <div class="mb-4">
      <UButtonGroup>
        <UButton
          v-for="view in ['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek']"
          :key="view"
          :variant="calendarView === view ? 'solid' : 'outline'"
          @click="setCalendarView(view)"
        >
          {{ view === 'dayGridMonth' ? 'Month' : 
             view === 'timeGridWeek' ? 'Week' : 
             view === 'timeGridDay' ? 'Day' : 'List' }}
        </UButton>
      </UButtonGroup>
    </div>

    <Calendar
      :events="events"
      :initial-view="calendarView"
      :editable="true"
      :selectable="true"
      @event-click="handleEventClick"
      @date-click="handleDateClick"
      @event-drop="handleEventDrop"
      @event-resize="handleEventResize"
    />

    <UCard v-if="selectedEvent" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">{{ selectedEvent.title }}</h3>
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="deleteEvent(selectedEvent.id)"
          />
        </div>
      </template>
      
      <div class="space-y-2">
        <p><strong>Start:</strong> {{ new Date(selectedEvent.start).toLocaleString() }}</p>
        <p v-if="selectedEvent.end"><strong>End:</strong> {{ new Date(selectedEvent.end).toLocaleString() }}</p>
        <p v-if="selectedEvent.extendedProps?.description">
          <strong>Description:</strong> {{ selectedEvent.extendedProps.description }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<style>
/* FullCalendar custom styles */
.fc .fc-button-primary {
  @apply bg-primary hover:bg-primary-700 border-transparent;
}

.fc .fc-button-primary:disabled {
  @apply bg-gray-400;
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  @apply bg-primary-800 border-transparent;
}

.fc-theme-standard .fc-list,
.fc-theme-standard td,
.fc-theme-standard th {
  @apply border-gray-200 dark:border-gray-700;
}

.dark .fc-theme-standard .fc-list-day-cushion {
  @apply bg-gray-800;
}

.dark .fc .fc-list-event:hover td {
  @apply bg-gray-700;
}

.dark .fc-theme-standard .fc-list-empty {
  @apply bg-gray-800;
}

.dark .fc-theme-standard .fc-list-day-cushion {
  @apply bg-gray-800;
}

.dark .fc-daygrid-day.fc-day-today {
  @apply bg-gray-800;
}

.dark .fc-col-header-cell {
  @apply bg-gray-800;
}

.dark .fc-scrollgrid-section-header th {
  @apply bg-gray-800;
}
</style> 