/**
 * Calendar-related interfaces for the application
 */

/**
 * Calendar event data model
 */
export interface CalendarEvent {
  /** Unique identifier for the event */
  id?: string;

  /** Event title */
  title: string;

  /** Start date/time in ISO format */
  start: string;

  /** End date/time in ISO format (optional) */
  end?: string | null;

  /** User who owns this event */
  userId: string;

  /** House ID this event belongs to */
  houseId?: string;

  /** Additional properties for the event */
  extendedProps: CalendarEventExtendedProps;
}

/**
 * Additional properties for calendar events
 */
export interface CalendarEventExtendedProps {
  /** Color for the event in the calendar */
  color: string;

  /** Notes for the event */
  eventnotes?: string;

  /** Whether this event is a turnover day */
  turn: boolean;

  /** Date of the turnover in ISO format */
  turndate?: string;

  /** Check-in time for turnover */
  turncheckintime?: string;

  /** Check-out time for turnover */
  turncheckouttime?: string;

  /** Whether the event is all-day */
  allDay?: boolean;
}

/**
 * FullCalendar view types
 */
export type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

/**
 * External view type mapping
 */
export type ExternalViewType = "month" | "week" | "day";

/**
 * View option for calendar display
 */
export interface ViewOption {
  /** Display name for the view */
  title: string;

  /** View value for FullCalendar */
  value: CalendarViewType;
}

/**
 * Calendar configuration
 */
export interface CalendarConfig {
  /** Initial view to display */
  initialView: CalendarViewType;

  /** Whether events can be edited */
  editable: boolean;

  /** Whether dates can be selected */
  selectable: boolean;
}

/**
 * Time slot for available booking times
 */
export interface TimeSlot {
  /** Display label */
  label: string;

  /** Time value in HH:MM format */
  value: string;
}
