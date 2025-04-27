/**
 * Store interfaces for the application
 */
import { UserData, House } from "./user";
import { CalendarEvent } from "./calendar";

/**
 * User store state
 */
export interface UserStoreState {
  /** Current user data */
  userData: UserData | null;

  /** Whether data is being loaded */
  isLoading: boolean;

  /** Error message if operation failed */
  error: string | null;

  /** Currently selected house */
  selectedHouse: House | null;

  /** ID of the currently selected house */
  selectedHouseId: string | null;

  /** Function to unsubscribe from Firestore listener */
  unsubscribeUser: (() => void) | null;
}

/**
 * Calendar store state
 */
export interface CalendarStoreState {
  /** List of events */
  events: CalendarEvent[];

  /** Whether events are being loaded */
  isLoading: boolean;

  /** Error message if operation failed */
  error: string | null;

  /** Currently selected event */
  selectedEvent: CalendarEvent | null;
}

/**
 * UI store state for managing UI-related state across components
 */
export interface UiStoreState {
  /** Whether dark mode is enabled */
  darkMode: boolean;

  /** Whether any modal is open */
  isModalOpen: boolean;

  /** Which modal is currently open */
  activeModal: "event" | "house" | "user" | null;

  /** Whether the sidebar is collapsed */
  isSidebarCollapsed: boolean;
}
