import type { EventInput } from "@fullcalendar/core";

export interface CalendarEvent extends EventInput {
  id: string;
  userId: string;
  turn?: boolean;
  turndate?: string;
  color?: string;
}

export interface CalendarViewOption {
  title: string;
  value: string;
}

export interface CalendarProps {
  view?: string;
  selectedHouseId?: string;
}

export interface CalendarEmits {
  (
    e: "openEventModal",
    data: { startDate: string; endDate: string; event: CalendarEvent | null }
  ): void;
  (e: "updateEvent", event: CalendarEvent): void;
  (e: "deleteEvent", eventId: string): void;
}

export interface CalendarOptions {
  plugins: any[];
  headerToolbar: {
    left: string;
    center: string;
    right: string;
  };
  initialView: string;
  height: number;
  eventDidMount: (info: any) => void;
  dayCellDidMount: (arg: any) => void;
  datesSet: (dateInfo: any) => void;
  selectable: boolean;
  select: (selectInfo: any) => void;
  eventClick: (clickInfo: any) => void;
  events: (
    fetchInfo: any,
    successCallback: (events: CalendarEvent[]) => void,
    failureCallback: (error: Error) => void
  ) => Promise<void>;
  eventResize: (eventResizeInfo: any) => Promise<void>;
  editable: boolean;
  eventDrop: (eventDropInfo: any) => Promise<void>;
  dayMaxEventRows: boolean;
  lazyFetching: boolean;
  rerenderDelay: number;
}
