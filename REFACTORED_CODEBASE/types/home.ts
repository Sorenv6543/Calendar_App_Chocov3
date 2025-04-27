import type { CalendarEvent } from "./calendar";

export interface EventData {
  userId?: string;
  title: string;
  start: string;
  end: string;
  houseId?: string;
  description?: string;
  [key: string]: any;
}

export interface HomeProps {
  userId?: string;
  view?: string;
}

export interface HomeEmits {
  (
    e: "openEventModal",
    data: {
      event: CalendarEvent | undefined;
      startDate: string;
      endDate: string;
    }
  ): void;
  (e: "createEvent", eventData: EventData): Promise<any>;
  (e: "updateEvent", eventData: EventData): Promise<void>;
  (e: "deleteEvent", eventId: string): Promise<void>;
}
