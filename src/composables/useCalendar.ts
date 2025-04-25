import type {
  CalendarEvent,
  CalendarViewType,
  TimeSlot,
} from "~/models/calendar";

interface UseCalendarOptions {
  initialView?: CalendarViewType;
  editable?: boolean;
  selectable?: boolean;
}

export function useCalendar(options: UseCalendarOptions = {}) {
  const {
    initialView = "dayGridMonth",
    editable = true,
    selectable = true,
  } = options;

  // State
  const currentView = ref<CalendarViewType>(initialView);
  const events = ref<CalendarEvent[]>([]);
  const selectedDate = ref<Date | null>(null);

  // Computed
  const formattedEvents = computed(() => {
    return events.value.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : null,
    }));
  });

  // Methods
  const changeView = (view: CalendarViewType) => {
    currentView.value = view;
  };

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    events.value.push(newEvent);
    return newEvent;
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    const index = events.value.findIndex((e) => e.id === eventId);
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updates };
    }
  };

  const deleteEvent = (eventId: string) => {
    events.value = events.value.filter((e) => e.id !== eventId);
  };

  const selectDate = (date: Date) => {
    selectedDate.value = date;
  };

  // Time slots for booking
  const timeSlots = computed<TimeSlot[]>(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({
        label: time,
        value: time,
      });
    }
    return slots;
  });

  return {
    // State
    currentView,
    events: formattedEvents,
    selectedDate,
    timeSlots,

    // Methods
    changeView,
    addEvent,
    updateEvent,
    deleteEvent,
    selectDate,
  };
}
