/**
 * Calendar-related constants
 */

import { CalendarViewType, ViewOption } from "../models/calendar";

/**
 * Default calendar views available in the application
 */
export const CALENDAR_VIEWS: ViewOption[] = [
  { title: "Month", value: "dayGridMonth" },
  { title: "Week", value: "timeGridWeek" },
  { title: "Day", value: "timeGridDay" },
];

/**
 * Map external view values to internal FullCalendar view values
 */
export const VIEW_MAP: Record<string, CalendarViewType> = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  day: "timeGridDay",
};

/**
 * Default time slots for check-in times
 */
export const CHECK_IN_TIME_SLOTS = [
  { label: "12:00 PM", value: "12:00" },
  { label: "1:00 PM", value: "13:00" },
  { label: "2:00 PM", value: "14:00" },
  { label: "3:00 PM", value: "15:00" },
  { label: "4:00 PM", value: "16:00" },
  { label: "5:00 PM", value: "17:00" },
  { label: "6:00 PM", value: "18:00" },
];

/**
 * Default time slots for check-out times
 */
export const CHECK_OUT_TIME_SLOTS = [
  { label: "8:00 AM", value: "08:00" },
  { label: "9:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
];

/**
 * Default colors for events and houses
 */
export const DEFAULT_COLORS = [
  "#2979ff", // Blue
  "#43a047", // Green
  "#e53935", // Red
  "#ff9800", // Orange
  "#9c27b0", // Purple
  "#00acc1", // Cyan
  "#5e35b1", // Deep Purple
  "#f44336", // Red
  "#3f51b5", // Indigo
  "#4caf50", // Green
];
