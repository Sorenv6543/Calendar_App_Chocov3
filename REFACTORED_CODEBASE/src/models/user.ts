/**
 * User-related interfaces for the application
 */

/**
 * User authentication information
 */
export interface User {
  /** Unique identifier for the user */
  id: string;

  /** User's email address */
  email: string;

  /** User's display name */
  displayName: string;

  /** URL to user's profile photo */
  photoURL?: string;

  /** User's role in the system */
  role: UserRole;

  /** Whether the user's email is verified */
  emailVerified: boolean;

  /** Timestamp when the user was created */
  createdAt: string;

  /** Timestamp when the user was last updated */
  updatedAt: string;
}

/**
 * Full user data including preferences and houses
 */
export interface UserData extends User {
  houses: House[];
}

/**
 * House data model
 */
export interface House {
  /** Firebase user ID of the owner */
  userId: string;

  /** Unique identifier for the house */
  houseId: string;

  /** House name or address */
  address: string;

  /** Color used for the house events in the calendar */
  color: string;

  /** Whether this house is currently selected */
  selected?: boolean;

  /** Contact number for the house */
  contactnumber?: string;

  /** Default check-in time */
  checkInTime?: string;

  /** Default check-out time */
  checkOutTime?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** User's preferred language */
  language: string;

  /** User's preferred theme (light/dark) */
  theme: 'light' | 'dark';

  /** User's preferred timezone */
  timezone: string;

  /** User's notification preferences */
  notifications: {
    email: boolean;
    push: boolean;
    calendarUpdates: boolean;
  };
}

export type UserRole = 'admin' | 'manager' | 'user';

export interface UserSettings {
  /** User's general settings */
  preferences: UserPreferences;

  /** User's calendar-specific settings */
  calendar: {
    defaultView: CalendarViewType;
    showWeekends: boolean;
    businessHours: {
      start: string;
      end: string;
    };
  };
}
