<template>
  <div class="calendar-container">
    <FullCalendar :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div class="event-content">
          <div class="event-title">{{ arg.event.title }}</div>
          <div v-if="arg.event.extendedProps.house" class="event-house">
            <div
              class="house-color-indicator"
              :style="{ backgroundColor: arg.event.extendedProps.house.color }"
            ></div>
            <span>{{ arg.event.extendedProps.house.address }}</span>
          </div>
          <div v-if="arg.event.extendedProps.turn" class="event-turn">
            <v-icon size="small">mdi-clock-outline</v-icon>
            <span>{{ arg.event.extendedProps.turnCheckInTime }} - {{ arg.event.extendedProps.turnCheckOutTime }}</span>
          </div>
        </div>
      </template>
    </FullCalendar>
  </div>
</template>

<script setup lang="ts">
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { ref, computed } from 'vue'
import type { EventInput } from '@fullcalendar/core'
import type { House } from '~/types'

interface CalendarEvent extends EventInput {
  extendedProps: {
    house?: House
    turn?: boolean
    turnCheckInTime?: string
    turnCheckOutTime?: string
    isRecurring?: boolean
    recurrencePattern?: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
      interval: number
      endDate: string | null
      count: number | null
    }
  }
}

const props = defineProps<{
  events: CalendarEvent[]
  initialDate?: string
  height?: string
}>()

const emit = defineEmits<{
  (e: 'dateClick', date: string): void
  (e: 'eventClick', event: CalendarEvent): void
  (e: 'eventDrop', event: CalendarEvent): void
  (e: 'eventResize', event: CalendarEvent): void
}>()

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  height: props.height || 'auto',
  initialDate: props.initialDate,
  events: props.events,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: 'short'
  },
  dateClick: (arg: { dateStr: string }) => {
    emit('dateClick', arg.dateStr)
  },
  eventClick: (arg: { event: CalendarEvent }) => {
    emit('eventClick', arg.event)
  },
  eventDrop: (arg: { event: CalendarEvent }) => {
    emit('eventDrop', arg.event)
  },
  eventResize: (arg: { event: CalendarEvent }) => {
    emit('eventResize', arg.event)
  }
}))
</script>

<style>
@import '@fullcalendar/core/main.css';
@import '@fullcalendar/daygrid/main.css';
@import '@fullcalendar/timegrid/main.css';
@import '@fullcalendar/list/main.css';

.calendar-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.event-content {
  padding: 4px;
}

.event-title {
  font-weight: 500;
  margin-bottom: 2px;
}

.event-house {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.7);
}

.house-color-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.event-turn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.7);
}

:deep(.fc) {
  --fc-border-color: rgba(255, 255, 255, 0.1);
  --fc-button-bg-color: var(--v-primary-base);
  --fc-button-border-color: var(--v-primary-base);
  --fc-button-hover-bg-color: var(--v-primary-darken-1);
  --fc-button-hover-border-color: var(--v-primary-darken-1);
  --fc-button-active-bg-color: var(--v-primary-darken-2);
  --fc-button-active-border-color: var(--v-primary-darken-2);
  --fc-event-bg-color: var(--v-primary-base);
  --fc-event-border-color: var(--v-primary-base);
  --fc-event-text-color: white;
}

:deep(.fc-day-today) {
  background: rgba(var(--v-primary-base-rgb), 0.1) !important;
}

:deep(.fc-event) {
  border-radius: 4px;
  padding: 2px 4px;
  margin: 1px 0;
}

:deep(.fc-event:hover) {
  opacity: 0.9;
}
</style> 