/**
 * Index file to re-export all models
 */

// Export all models
export * from './user'
export * from './calendar'
export * from './house'
export * from './auth'

// Re-export commonly used types
export type {
  User,
  UserRole,
  UserPreferences,
  UserSettings
} from './user'

export type {
  CalendarEvent,
  CalendarViewType,
  ExternalViewType,
  CalendarConfig,
  TimeSlot,
  CalendarFilters
} from './calendar'

export type {
  House,
  HouseStatus,
  HouseAvailability,
  HouseBooking,
  BookingStatus,
  PaymentStatus
} from './house'

export type {
  AuthState,
  LoginCredentials,
  RegisterData,
  PasswordResetRequest,
  PasswordResetData,
  AuthResponse,
  AuthError
} from './auth'
