/**
 * User-related interfaces for the application
 */

/**
 * User authentication information
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
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
  /** Default calendar view (month, week, day) */
  defaultView: string;

  /** Dark/light mode preference */
  theme: "light" | "dark" | "system";
}
