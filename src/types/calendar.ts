import {
  EventInput,
  EventSourceInput,
  EventSourceError,
  EventSourceSuccessResponseHandler,
  DateSelectArg,
  EventClickArg,
  EventMountArg,
  EventResizeDoneArg,
  EventDragStopArg,
  BaseOptions,
} from "@fullcalendar/core";

// Base event properties that are common to all calendar events
export interface BaseCalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date | null;
  allDay?: boolean;
  url?: string;
  classNames?: string[];
  editable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  resourceEditable?: boolean;
  display?:
    | "auto"
    | "block"
    | "list-item"
    | "background"
    | "inverse-background"
    | "none";
  overlap?: boolean;
  constraint?: any;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: Record<string, any>;
}

// Extended properties specific to our application
export interface CalendarEventExtendedProps {
  color: string;
  eventnotes?: string;
  turn: boolean;
  turndate?: string;
  turncheckintime?: string;
  turncheckouttime?: string;
  houseId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Our application's calendar event type
export interface CalendarEvent extends BaseCalendarEvent {
  extendedProps: CalendarEventExtendedProps;
  userId: string;
  houseId?: string;
}

// House data type
export interface House {
  houseId: string;
  userId: string;
  name: string;
  address: string;
  color: string;
  selected?: boolean;
  contactnumber?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Calendar view types
export type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay";
export type ExternalViewType = "month" | "week" | "day";

// View options
export interface ViewOption {
  title: string;
  value: CalendarViewType;
}

export interface CalendarViewOption {
  title: string;
  value: string;
}

// Calendar component props
export interface CalendarProps {
  userId: string;
  selectedHouseId?: string | null;
  view?: ExternalViewType;
}

// Calendar component emits
export interface CalendarEmits {
  (
    e: "openEventModal",
    data: { startDate: string; endDate: string; event: CalendarEvent | null }
  ): void;
  (e: "createEvent", event: CalendarEvent): void;
  (e: "updateEvent", event: CalendarEvent): void;
  (e: "deleteEvent", eventId: string): void;
}

// FullCalendar event info types
export interface EventInfo {
  event: {
    id: string;
    start: Date | null;
    end: Date | null;
    title: string;
    extendedProps: CalendarEventExtendedProps;
  };
  revert: () => void;
}

// Calendar options with proper typing
export interface CalendarOptions extends BaseOptions {
  plugins: any[];
  headerToolbar: {
    left: string;
    center: string;
    right: string;
  };
  initialView: CalendarViewType;
  height: number;
  eventDidMount: (info: EventMountArg) => void;
  dayCellDidMount: (arg: { el: HTMLElement; date: Date }) => void;
  datesSet: (dateInfo: {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
    timeZone: string;
  }) => void;
  selectable: boolean;
  select: (selectInfo: DateSelectArg) => void;
  eventClick: (clickInfo: EventClickArg) => void;
  events: (
    fetchInfo: { start: Date; end: Date; timeZone: string },
    successCallback: (events: CalendarEvent[]) => void,
    failureCallback: (error: Error) => void
  ) => Promise<void>;
  eventResize: (resizeInfo: EventResizeDoneArg) => Promise<void>;
  editable: boolean;
  eventDrop: (dropInfo: EventDragStopArg) => Promise<void>;
  dayMaxEventRows: boolean;
  lazyFetching: boolean;
  rerenderDelay: number;
}

// Event source input type
export type CalendarEventSource = EventSourceInput<CalendarEvent>;

// Event source success handler type
export type CalendarEventSourceSuccessHandler =
  EventSourceSuccessResponseHandler<CalendarEvent>;

// Event source error handler type
export type CalendarEventSourceErrorHandler = (error: EventSourceError) => void;
