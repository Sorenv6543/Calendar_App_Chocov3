import { ref, computed } from 'vue';
import type { CalendarEvent } from '@/types/calendar';
import { db } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export function useCalendarEvents() {
    const selectedEvent = ref<CalendarEvent | null>(null);
    const selectedEventId = ref<string | null>(null);
    const eventStartDate = ref<string>("");
    const eventEndDate = ref<string>("");
    const events = ref<CalendarEvent[]>([]);

    const handleDateSelect = (selectInfo: any, emit: (event: string, data: any) => void): void => {
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

    const editEvent = (clickInfo: any, emit: (event: string, data: any) => void): void => {
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

    const formatDateForPicker = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const addEvent = (event: CalendarEvent) => {
        events.value.push(event);
    };

    const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
        const index = events.value.findIndex(e => e.id === eventId);
        if (index !== -1) {
            events.value[index] = { ...events.value[index], ...updates };
        }
    };

    const removeEvent = (eventId: string) => {
        events.value = events.value.filter(e => e.id !== eventId);
    };

    const getEventsByHouse = (houseId: string) => {
        return computed(() => 
            events.value.filter(e => e.extendedProps.house?.houseId === houseId)
        );
    };

    const getEventsByDate = (date: string) => {
        return computed(() => 
            events.value.filter(e => e.start === date)
        );
    };

    return {
        selectedEvent,
        selectedEventId,
        eventStartDate,
        eventEndDate,
        handleDateSelect,
        editEvent,
        handleEventResize,
        handleEventDrop,
        formatDateForPicker,
        events,
        addEvent,
        updateEvent,
        removeEvent,
        getEventsByHouse,
        getEventsByDate
    };
} 