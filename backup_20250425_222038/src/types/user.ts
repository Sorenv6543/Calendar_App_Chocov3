export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'guest';

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export interface UserSettings {
  calendar: {
    defaultView: CalendarViewType;
    showWeekends: boolean;
    businessHours: {
      start: string;
      end: string;
    };
  };
  notifications: {
    bookingConfirmation: boolean;
    bookingReminder: boolean;
    paymentReminder: boolean;
    maintenanceAlert: boolean;
  };
}

export type CalendarViewType = 'day' | 'week' | 'month' | 'list'; 