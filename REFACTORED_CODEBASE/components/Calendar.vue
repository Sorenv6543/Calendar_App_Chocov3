<script setup lang="ts">
import type { EventInput } from "@fullcalendar/core";
import { ref, onMounted, onUnmounted } from "vue";

const { calendarPlugins } = useNuxtApp();

const props = defineProps({
  events: {
    type: Array as () => EventInput[],
    default: () => [],
  },
  initialView: {
    type: String,
    default: "dayGridMonth",
  },
  editable: {
    type: Boolean,
    default: true,
  },
  selectable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["eventClick", "dateClick", "eventDrop", "eventResize"]);

const calendarRef = ref(null);
const calendarHeight = ref(window.innerHeight - 200);

const handleResize = () => {
  calendarHeight.value = window.innerHeight - 200;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const calendarOptions = ref({
  plugins: [
    calendarPlugins.dayGrid,
    calendarPlugins.timeGrid,
    calendarPlugins.list,
    calendarPlugins.interaction,
  ],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  initialView: props.initialView,
  editable: props.editable,
  selectable: props.selectable,
  selectMirror: true,
  dayMaxEvents: true,
  height: calendarHeight.value,
  events: props.events,
  eventClick: (info) => emit("eventClick", info),
  dateClick: (info) => emit("dateClick", info),
  eventDrop: (info) => emit("eventDrop", info),
  eventResize: (info) => emit("eventResize", info),
});
</script>

<template>
  <div class="calendar-container">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<style scoped>
.calendar-container {
  height: v-bind(calendarHeight + "px");
  width: 100%;
}

:deep(.fc-event) {
  cursor: pointer;
}

:deep(.fc-toolbar-title) {
  font-size: 1.2rem !important;
}

:deep(.fc-button) {
  @apply bg-primary text-white border-none hover:bg-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50;
}

:deep(.fc-button-active) {
  @apply bg-primary-700 !important;
}
</style>
