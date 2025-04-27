import { ref, computed } from 'vue';
import type { CalendarEvent, CalendarOptions, CalendarViewOption } from '@/types/calendar';
import { useUserStore } from '@/stores/userStore';
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import debounce from 'lodash/debounce';

export function useCalendar() {
    const userStore = useUserStore();
    const calendarRef = ref<any>(null);
    const calendarHeight = ref<number>(window.innerHeight - 20);
    const currentView = ref<string>('dayGridMonth');

    const viewOptions: CalendarViewOption[] = [
        { title: 'Month', value: 'dayGridMonth' },
        { title: 'Week', value: 'timeGridWeek' },
        { title: 'Day', value: 'timeGridDay' }
    ];

    const viewMap: Record<string, string> = {
        'month': 'dayGridMonth',
        'week': 'timeGridWeek',
        'day': 'timeGridDay'
    };

    const handleResize = (): void => {
        calendarHeight.value = window.innerHeight - 20;
        if (calendarRef.value?.getApi) {
            calendarRef.value.getApi().setOption('height', calendarHeight.value);
        }
    };

    const changeCalendarView = (view: string): void => {
        if (calendarRef.value?.getApi) {
            calendarRef.value.getApi().changeView(view);
            currentView.value = view;
        }
    };

    const fetchEvents = async (
        fetchInfo: any,
        successCallback: (events: CalendarEvent[]) => void,
        failureCallback: (error: Error) => void
    ): Promise<void> => {
        try {
            const q = query(
                collection(db, "events"),
                where("userId", "==", userStore.userData?.id)
            );
            const querySnapshot = await getDocs(q);
            const events = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as CalendarEvent[];
            successCallback(events);
        } catch (error) {
            console.error("Error fetching events:", error);
            failureCallback(error as Error);
        }
    };

    const refreshTurnDayHighlights = (): void => {
        const api = calendarRef.value?.getApi();
        if (!api) return;

        requestAnimationFrame(() => {
            const events = api.getEvents();
            const turnDates = events
                .filter(event => event.extendedProps?.turn === true && event.extendedProps?.turndate)
                .map(event => event.extendedProps.turndate);

            const turnDatesSet = new Set(turnDates);
            const cells = Array.from(document.querySelectorAll('.fc-daygrid-day'));
            const toAdd: Element[] = [];
            const toRemove: Element[] = [];

            cells.forEach(cell => {
                const cellDate = cell.getAttribute('data-date');
                const shouldHaveClass = cellDate ? turnDatesSet.has(cellDate) : false;
                const hasClass = cell.classList.contains('has-turn-day');

                if (shouldHaveClass && !hasClass) {
                    toAdd.push(cell);
                } else if (!shouldHaveClass && hasClass) {
                    toRemove.push(cell);
                }
            });

            if (toAdd.length > 0 || toRemove.length > 0) {
                requestAnimationFrame(() => {
                    toAdd.forEach(cell => cell.classList.add('has-turn-day'));
                    toRemove.forEach(cell => cell.classList.remove('has-turn-day'));
                });
            }
        });
    };

    const debouncedRefreshHighlights = debounce(() => {
        refreshTurnDayHighlights();
    }, 200);

    const calendarOptions = computed<CalendarOptions>(() => ({
        plugins: [],
        headerToolbar: {
            left: "",
            center: "title",
            right: "",
        },
        initialView: "dayGridMonth",
        height: calendarHeight.value,
        eventDidMount: (info: { el: HTMLElement; event: { extendedProps: { color?: string } } }) => {
            info.el.style.setProperty('--event-color', info.event.extendedProps.color || '#2979ff');
            info.el.style.backgroundColor = info.event.extendedProps.color || '#2979ff';
            info.el.style.opacity = '1';
        },
        dayCellDidMount: (arg: { date: Date; el: HTMLElement }) => {
            const cellDate = arg.date.toISOString().split('T')[0];
            const api = calendarRef.value?.getApi();
            const events = api ? api.getEvents() : [];

            const hasTurnOnDay = events.some(event => {
                return event.extendedProps?.turn === true &&
                    event.extendedProps?.turndate === cellDate;
            });

            if (hasTurnOnDay) {
                arg.el.classList.add('has-turn-day');
            }
        },
        datesSet: (dateInfo: { start: Date; end: Date }) => {
            if (calendarRef.value?.getApi) {
                calendarRef.value.getApi().refetchEvents();
                debouncedRefreshHighlights();
            }
        },
        selectable: true,
        events: fetchEvents,
        editable: true,
        dayMaxEventRows: true,
        lazyFetching: true,
        rerenderDelay: 50,
    }));

    return {
        calendarRef,
        calendarHeight,
        currentView,
        viewOptions,
        viewMap,
        handleResize,
        changeCalendarView,
        calendarOptions,
        refreshTurnDayHighlights,
        debouncedRefreshHighlights
    };
} 