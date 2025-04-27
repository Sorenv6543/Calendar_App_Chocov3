/**
 * Calendar-related interfaces for the application
 */

import type { User } from './user'

/**
 * Calendar event data model
 */
export interface CalendarEvent {
  /** Unique identifier for the event */
  id: string;

  /** Property ID this event belongs to */
  propertyId: string;

  /** Event title */
  title: string;

  /** Start date/time in ISO format */
  start: string;

  /** End date/time in ISO format (optional) */
  end: string;

  /** Whether the event is all-day */
  allDay: boolean;

  /** Event type */
  type: 'cleaning' | 'inspection' | 'maintenance' | 'other';

  /** Event status */
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  /** Color for the event in the calendar */
  color: string;

  /** Additional properties for the event */
  extendedProps: {
    /** Job ID for the event */
    jobId?: string;

    /** Assigned to */
    assignedTo?: {
      /** User ID of the assigned user */
      userId: string;

      /** Name of the assigned user */
      name: string;
    };

    /** Notes for the event */
    notes: string[];

    /** Supplies needed for the event */
    suppliesNeeded: string[];

    /** Special instructions for the event */
    specialInstructions: string[];

    /** Check-in time for the event */
    checkInTime?: string;

    /** Check-out time for the event */
    checkOutTime?: string;
  };

  /** Timestamp when the event was created */
  createdAt: string;

  /** Timestamp when the event was last updated */
  updatedAt: string;
}

/**
 * FullCalendar view types
 */
export type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

/**
 * External view type mapping
 */
export type ExternalViewType = 'month' | 'week' | 'day';

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

  /** Business hours configuration */
  businessHours: {
    /** Days of the week (0-6, where 0 is Sunday) */
    daysOfWeek: number[];

    /** Start time in HH:mm format */
    startTime: string;

    /** End time in HH:mm format */
    endTime: string;
  };

  /** Event display option */
  eventDisplay?: 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';

  /** Event time format */
  eventTimeFormat?: {
    /** Hour format */
    hour: 'numeric' | '2-digit';

    /** Minute format */
    minute: 'numeric' | '2-digit';

    /** Whether to use 12-hour format */
    hour12: boolean;
  };
}

/**
 * Time slot for available booking times
 */
export interface TimeSlot {
  /** Display label */
  label: string;

  /** Time value in HH:mm format */
  value: string;

  /** Whether the slot is available */
  available: boolean;
}

export interface CalendarFilters {
  /** Filter by property */
  propertyId?: string;

  /** Filter by assigned user */
  assignedTo?: string;

  /** Filter by event type */
  type?: string;

  /** Filter by event status */
  status?: string;

  /** Filter by date range */
  dateRange?: {
    start: string;
    end: string;
  };
}
