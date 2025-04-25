export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  color: string; // For calendar display
  contactNumber?: string;
  cleaningCompanyId?: string; // Reference to assigned cleaning company
}

/**
 * Represents a booking in the system
 */
export interface Booking {
  /** Unique identifier for the booking */
  id?: string;
  /** Reference to the property being booked */
  propertyId: string;
  /** Check-in date for the booking */
  checkIn: string;
  /** Check-out date for the booking */
  checkOut: string;
  /** Whether this booking has a turn */
  hasTurn: boolean;
  /** Associated turn information if hasTurn is true */
  turn: Turn | null;
  /** Current status of the booking */
  status?: "pending" | "confirmed" | "cancelled";
  /** Optional details about the booking */
  details?: string;
  /** Timestamp when the booking was created */
  createdAt?: string;
  /** Timestamp when the booking was last updated */
  updatedAt?: string;
}

/**
 * Represents a turn (same-day check-out and check-in) in the system
 */
export interface Turn {
  /** Unique identifier for the turn */
  id?: string;
  /** Reference to the associated booking */
  bookingId: string;
  /** Date of the turn */
  date: string;
  /** Check-in time for the turn */
  checkInTime: string;
  /** Check-out time for the turn */
  checkOutTime: string;
  /** Current status of the turn */
  status: "pending" | "completed" | "cancelled";
  /** Optional notes for the turn */
  notes?: string;
}

export interface CleaningSchedule {
  id: string;
  propertyId: string;
  date: string;
  checkOutTime: string;
  status: "pending" | "completed";
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  role: "property_owner" | "cleaning_company";
  name: string;
  properties?: Property[]; // For property owners
  assignedProperties?: Property[]; // For cleaning companies
}
