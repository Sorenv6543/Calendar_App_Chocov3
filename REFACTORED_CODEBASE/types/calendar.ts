import type { EventInput } from "@fullcalendar/core";

export interface House {
  houseId: string;
  address: string;
  color: string;
  userId: string;
  contactnumber?: string;
}

export interface CalendarEvent {
  id: string;
  propertyId: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  type: CalendarEventType;
  status: CalendarEventStatus;
  color: string;
  extendedProps: {
    notes?: string;
    location?: string;
    contact?: string;
    priority?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventType = 'cleaning' | 'inspection' | 'maintenance' | 'other';
export type CalendarEventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface CalendarViewOption {
  title: string;
  value: string;
}

export interface CalendarProps {
  userId?: string;
  view?: string;
  selectedHouseId?: string;
}

export interface CalendarEmits {
  (e: 'openEventModal', data: { event: CalendarEvent | null; startDate: string; endDate: string }): void;
  (e: 'createEvent', eventData: CalendarEvent): void;
  (e: 'updateEvent', eventData: CalendarEvent): void;
  (e: 'deleteEvent', eventId: string): void;
}

export interface CalendarOptions {
  plugins: any[];
  initialView: string;
  headerToolbar: {
    left: string;
    center: string;
    right: string;
  };
  height?: string;
  initialDate?: string;
  events: CalendarEvent[];
  editable: boolean;
  selectable: boolean;
  selectMirror: boolean;
  dayMaxEvents: boolean;
  weekends: boolean;
  eventTimeFormat: {
    hour: string;
    minute: string;
    meridiem: string;
  };
}

export interface CalendarConfig {
  defaultView: CalendarViewType;
  showWeekends: boolean;
  businessHours: {
    start: string;
    end: string;
  };
  slotDuration: string;
  slotMinTime: string;
  slotMaxTime: string;
}

export interface CalendarFilters {
  propertyId?: string;
  assignedTo?: string;
  type?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  bookingId?: string;
}
