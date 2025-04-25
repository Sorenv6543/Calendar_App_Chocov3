export interface CalendarEvent {
  id?: string;
  title: string;
  start: string;
  end?: string | null;
  userId: string;
  extendedProps: CalendarEventExtendedProps;
}

export interface CalendarEventExtendedProps {
  color: string;
  eventnotes?: string;
  turn: boolean;
  turndate?: string;
  turncheckintime?: string;
  turncheckouttime?: string;
}

export interface HouseData {
  houseId: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
export type ExternalViewType = 'month' | 'week' | 'day';

export interface ViewOption {
  title: string;
  value: CalendarViewType;
} 