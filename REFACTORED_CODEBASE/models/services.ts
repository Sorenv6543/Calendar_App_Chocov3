/**
 * Service interfaces for the application
 */
import { CalendarEvent } from "./calendar";
import { House } from "./user";

/**
 * Event service interface
 */
export interface EventService {
  /** Fetch events for a user */
  fetchEvents(userId: string, houseId?: string): Promise<CalendarEvent[]>;

  /** Add a new event */
  addEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent>;

  /** Update an existing event */
  updateEvent(event: CalendarEvent): Promise<CalendarEvent>;

  /** Delete an event */
  deleteEvent(eventId: string): Promise<boolean>;
}

/**
 * House service interface
 */
export interface HouseService {
  /** Fetch houses for a user */
  fetchHouses(userId: string): Promise<House[]>;

  /** Add a new house */
  addHouse(house: Omit<House, "houseId">): Promise<House>;

  /** Update an existing house */
  updateHouse(house: House): Promise<House>;

  /** Delete a house */
  deleteHouse(houseId: string): Promise<boolean>;
}

/**
 * Error response from API
 */
export interface ApiError {
  /** Error code */
  code: string;

  /** Error message */
  message: string;
}
