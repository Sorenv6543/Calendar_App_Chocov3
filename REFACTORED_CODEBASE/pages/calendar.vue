<script setup lang="ts">
import { useCalendar } from '~/composables/useCalendar'
import type { EventInput } from '@fullcalendar/core'
import type { DateClickArg, EventClickArg, EventDropArg, EventResizeArg } from '@fullcalendar/core'

const {
  events,
  selectedEvent,
  calendarView,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  setCalendarView
} = useCalendar()

const handleEventClick = (info: EventClickArg) => {
  setSelectedEvent(info.event)
}

const handleDateClick = (info: DateClickArg) => {
  const newEvent: EventInput = {
    id: Date.now().toString(),
    title: 'New Event',
    start: info.dateStr,
    allDay: info.allDay
  }
  addEvent(newEvent)
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

const calendarOptions = computed(() => ({
  initialView: calendarView.value,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true
}))
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Calendar</h1>
    
    <div class="mb-4">
      <UButton
        v-for="view in ['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek']"
        :key="view"
        :variant="calendarView === view ? 'solid' : 'outline'"
        class="mr-2"
        @click="setCalendarView(view)"
      >
        {{ view }}
      </UButton>
    </div>

    <FullCalendar
      :events="events"
      :options="calendarOptions"
      @eventClick="handleEventClick"
      @dateClick="handleDateClick"
      @eventDrop="handleEventDrop"
      @eventResize="handleEventResize"
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
        <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
        <p v-if="selectedEvent.end"><strong>End:</strong> {{ selectedEvent.end }}</p>
        <p v-if="selectedEvent.extendedProps?.description">
          <strong>Description:</strong> {{ selectedEvent.extendedProps.description }}
        </p>
      </div>
    </UCard>
  </div>
</template> 