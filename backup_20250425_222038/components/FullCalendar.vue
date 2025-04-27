<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { CalendarOptions } from '@fullcalendar/core'
import type { EventInput } from '@fullcalendar/core'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

interface Props {
  events?: EventInput[]
  options?: Partial<CalendarOptions>
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
  options: () => ({})
})

const emit = defineEmits<{
  (e: 'eventClick', event: any): void
  (e: 'dateClick', info: any): void
  (e: 'eventDrop', info: any): void
  (e: 'eventResize', info: any): void
}>()

const calendarRef = ref<HTMLElement | null>(null)
const calendarApi = ref<any>(null)

const defaultOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventClick: (info) => emit('eventClick', info),
  dateClick: (info) => emit('dateClick', info),
  eventDrop: (info) => emit('eventDrop', info),
  eventResize: (info) => emit('eventResize', info)
}

const calendarOptions = computed(() => ({
  ...defaultOptions,
  ...props.options,
  events: props.events
}))

onMounted(() => {
  if (calendarRef.value) {
    const calendar = new Calendar(calendarRef.value, calendarOptions.value)
    calendar.render()
    calendarApi.value = calendar
  }
})

// Expose methods
defineExpose({
  getApi: () => calendarApi.value
})
</script>

<template>
  <div ref="calendarRef" class="full-calendar" />
</template>

<style scoped>
.full-calendar {
  width: 100%;
  height: 600px;
}
</style> 