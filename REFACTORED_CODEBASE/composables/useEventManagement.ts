import { ref, computed } from 'vue';
import type { 
    EventBase, 
    EventFormData, 
    EventUpdateData, 
    EventValidationResult,
    EventFilters,
    EventStats,
    EventTimeRange,
    EventFilterOptions
} from '@/types/event';
import { db } from '@/firebaseConfig';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    Timestamp
} from 'firebase/firestore';
import { useUserStore } from '@/stores/userStore';
import { useHouse } from './useHouse';
import { useModalState } from './useModalState';
import { EventValidator } from '@/utils/eventValidation';

export function useEventManagement() {
    const userStore = useUserStore();
    const { selectedHouseId } = useHouse();
    const { openEventModal, closeEventModal } = useModalState();

    const events = ref<EventBase[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const selectedEvent = ref<EventBase | null>(null);
    const validationErrors = ref<EventValidationResult>({ isValid: true, errors: [] });
    const currentFilters = ref<EventFilters>({});

    const filterOptions = computed<EventFilterOptions>(() => ({
        timeRanges: [
            { start: '00:00', end: '06:00', label: 'Night (00:00 - 06:00)' },
            { start: '06:00', end: '12:00', label: 'Morning (06:00 - 12:00)' },
            { start: '12:00', end: '18:00', label: 'Afternoon (12:00 - 18:00)' },
            { start: '18:00', end: '24:00', label: 'Evening (18:00 - 24:00)' }
        ],
        statusOptions: [
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
            { value: 'all', label: 'All' }
        ],
        sortOptions: [
            { value: 'date', label: 'Date' },
            { value: 'title', label: 'Title' },
            { value: 'house', label: 'House' }
        ],
        sortOrderOptions: [
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' }
        ]
    }));

    const filteredEvents = computed(() => {
        let result = [...events.value];

        // Apply house filter
        if (currentFilters.value.houseId) {
            result = result.filter(event => event.extendedProps.houseId === currentFilters.value.houseId);
        }

        // Apply date range filter
        if (currentFilters.value.startDate) {
            const startDate = new Date(currentFilters.value.startDate);
            result = result.filter(event => new Date(event.start) >= startDate);
        }
        if (currentFilters.value.endDate) {
            const endDate = new Date(currentFilters.value.endDate);
            result = result.filter(event => new Date(event.start) <= endDate);
        }

        // Apply turn filter
        if (currentFilters.value.turnOnly) {
            result = result.filter(event => event.extendedProps.turn);
        }

        // Apply search text filter
        if (currentFilters.value.searchText) {
            const searchText = currentFilters.value.searchText.toLowerCase();
            result = result.filter(event => 
                event.title.toLowerCase().includes(searchText) ||
                event.extendedProps.eventnotes?.toLowerCase().includes(searchText) ||
                event.extendedProps.address?.toLowerCase().includes(searchText)
            );
        }

        // Apply status filter
        const now = new Date();
        if (currentFilters.value.status === 'upcoming') {
            result = result.filter(event => new Date(event.start) > now);
        } else if (currentFilters.value.status === 'past') {
            result = result.filter(event => new Date(event.start) < now);
        }

        // Apply color filter
        if (currentFilters.value.color) {
            result = result.filter(event => event.extendedProps.color === currentFilters.value.color);
        }

        // Apply notes filter
        if (currentFilters.value.hasNotes) {
            result = result.filter(event => !!event.extendedProps.eventnotes);
        }

        // Apply contact filter
        if (currentFilters.value.hasContact) {
            result = result.filter(event => !!event.extendedProps.contactnumber);
        }

        // Apply sorting
        if (currentFilters.value.sortBy) {
            result.sort((a, b) => {
                let comparison = 0;
                switch (currentFilters.value.sortBy) {
                    case 'date':
                        comparison = new Date(a.start).getTime() - new Date(b.start).getTime();
                        break;
                    case 'title':
                        comparison = a.title.localeCompare(b.title);
                        break;
                    case 'house':
                        comparison = (a.extendedProps.houseId || '').localeCompare(b.extendedProps.houseId || '');
                        break;
                }
                return currentFilters.value.sortOrder === 'desc' ? -comparison : comparison;
            });
        }

        return result;
    });

    const fetchEvents = async (filters: EventFilters = {}) => {
        loading.value = true;
        error.value = null;
        try {
            let q = query(collection(db, 'events'));
            
            if (filters.userId) {
                q = query(q, where('userId', '==', filters.userId));
            }
            if (filters.houseId) {
                q = query(q, where('extendedProps.houseId', '==', filters.houseId));
            }
            if (filters.dateRange) {
                q = query(
                    q,
                    where('start', '>=', Timestamp.fromDate(new Date(filters.dateRange.start))),
                    where('start', '<=', Timestamp.fromDate(new Date(filters.dateRange.end)))
                );
            }

            const querySnapshot = await getDocs(q);
            events.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as EventBase));
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch events';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const validateEvent = (eventData: EventFormData): EventValidationResult => {
        validationErrors.value = EventValidator.validateEvent(eventData);
        return validationErrors.value;
    };

    const createEvent = async (eventData: Omit<EventBase, 'id'>) => {
        loading.value = true;
        error.value = null;
        try {
            const validation = EventValidator.validateEvent(eventData);
            if (!validation.isValid) {
                error.value = validation.errors[0].message;
                return;
            }

            const docRef = await addDoc(collection(db, 'events'), {
                ...eventData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            events.value.push({
                id: docRef.id,
                ...eventData
            });

            return docRef.id;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create event';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateEvent = async (eventId: string, updates: Partial<EventBase>) => {
        loading.value = true;
        error.value = null;
        try {
            const validation = EventValidator.validateEvent(updates);
            if (!validation.isValid) {
                error.value = validation.errors[0].message;
                return;
            }

            const eventRef = doc(db, 'events', eventId);
            const firestoreUpdates = {
                ...updates,
                updatedAt: Timestamp.now()
            };

            await updateDoc(eventRef, firestoreUpdates);

            const index = events.value.findIndex(e => e.id === eventId);
            if (index !== -1) {
                events.value[index] = {
                    ...events.value[index],
                    ...updates,
                    extendedProps: {
                        ...events.value[index].extendedProps,
                        ...firestoreUpdates.extendedProps
                    }
                };
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update event';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteEvent = async (eventId: string) => {
        loading.value = true;
        error.value = null;
        try {
            await deleteDoc(doc(db, 'events', eventId));
            events.value = events.value.filter(e => e.id !== eventId);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete event';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getEventStats = async (): Promise<EventStats> => {
        loading.value = true;
        error.value = null;
        try {
            const q = query(collection(db, 'events'));
            const querySnapshot = await getDocs(q);
            const events = querySnapshot.docs.map(doc => doc.data() as EventBase);

            const now = new Date();
            return {
                total: events.length,
                upcoming: events.filter(e => new Date(e.start) > now).length,
                completed: events.filter(e => new Date(e.end || e.start) < now).length,
                cancelled: events.filter(e => e.extendedProps.status === 'cancelled').length
            };
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to get event stats';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const setFilters = (filters: Partial<EventFilters>): void => {
        currentFilters.value = { ...currentFilters.value, ...filters };
    };

    const clearFilters = (): void => {
        currentFilters.value = {};
    };

    const handleEventClick = (event: EventBase): void => {
        selectedEvent.value = event;
        openEventModal();
    };

    const handleDateSelect = (startDate: string, endDate: string): void => {
        selectedEvent.value = null;
        openEventModal();
    };

    const clearSelectedEvent = (): void => {
        selectedEvent.value = null;
        validationErrors.value = { isValid: true, errors: [] };
    };

    return {
        events,
        filteredEvents,
        selectedEvent,
        loading,
        error,
        validationErrors,
        currentFilters,
        filterOptions,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        handleEventClick,
        handleDateSelect,
        clearSelectedEvent,
        getEventStats,
        validateEvent,
        setFilters,
        clearFilters
    };
} 