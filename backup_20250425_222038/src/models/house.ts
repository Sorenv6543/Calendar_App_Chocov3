import type { User } from './user'

export interface House {
  /** Unique identifier for the house */
  id: string

  /** House name or title */
  name: string

  /** House description */
  description: string

  /** House address */
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }

  /** House location coordinates */
  location?: {
    latitude: number
    longitude: number
  }

  /** House features and amenities */
  features: string[]

  /** House images */
  images: {
    url: string
    alt: string
    isPrimary: boolean
  }[]

  /** House status */
  status: HouseStatus

  /** House owner information */
  owner: {
    userId: string
    name: string
    contact: string
  }

  /** House manager information */
  manager?: {
    userId: string
    name: string
    contact: string
  }

  /** House settings */
  settings: {
    /** Check-in time in HH:mm format */
    checkInTime: string

    /** Check-out time in HH:mm format */
    checkOutTime: string

    /** Minimum stay duration in days */
    minStay: number

    /** Maximum stay duration in days */
    maxStay: number

    /** Cleaning fee */
    cleaningFee: number

    /** Security deposit */
    securityDeposit: number
  }

  /** Timestamp when the house was created */
  createdAt: string

  /** Timestamp when the house was last updated */
  updatedAt: string
}

export type HouseStatus = 'active' | 'inactive' | 'maintenance' | 'sold'

export interface HouseAvailability {
  /** House ID */
  houseId: string

  /** Date in ISO format */
  date: string

  /** Availability status */
  status: 'available' | 'booked' | 'blocked'

  /** If booked, the booking ID */
  bookingId?: string

  /** If blocked, the reason */
  blockReason?: string
}

export interface HouseBooking {
  /** Unique identifier for the booking */
  id: string

  /** House ID */
  houseId: string

  /** Guest information */
  guest: {
    userId: string
    name: string
    email: string
    phone: string
  }

  /** Booking dates */
  dates: {
    checkIn: string
    checkOut: string
  }

  /** Booking status */
  status: BookingStatus

  /** Number of guests */
  guests: number

  /** Total price */
  totalPrice: number

  /** Payment status */
  paymentStatus: PaymentStatus

  /** Special requests or notes */
  notes?: string

  /** Timestamp when the booking was created */
  createdAt: string

  /** Timestamp when the booking was last updated */
  updatedAt: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed' 