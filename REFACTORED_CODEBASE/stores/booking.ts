import { defineStore } from 'pinia'
import type { HouseBooking, BookingStatus, PaymentStatus } from '@/models'

interface BookingStoreState {
  bookings: HouseBooking[]
  selectedBooking: HouseBooking | null
  loading: boolean
  error: string | null
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingStoreState => ({
    bookings: [],
    selectedBooking: null,
    loading: false,
    error: null
  }),

  getters: {
    activeBookings: (state) => state.bookings.filter(booking => booking.status === 'active'),
    pendingBookings: (state) => state.bookings.filter(booking => booking.status === 'pending'),
    cancelledBookings: (state) => state.bookings.filter(booking => booking.status === 'cancelled'),
    isLoading: (state) => state.loading,
    bookingError: (state) => state.error,
    getBookingById: (state) => (id: string) => state.bookings.find(booking => booking.id === id)
  },

  actions: {
    async fetchBookings() {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual bookings fetch from Firebase
        // Mock data for now
        this.bookings = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch bookings'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createBooking(booking: Omit<HouseBooking, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual booking creation in Firebase
        const newBooking: HouseBooking = {
          ...booking,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.bookings.push(newBooking)
        return newBooking
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create booking'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateBooking(bookingId: string, updates: Partial<HouseBooking>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual booking update in Firebase
        const index = this.bookings.findIndex(booking => booking.id === bookingId)
        if (index !== -1) {
          this.bookings[index] = {
            ...this.bookings[index],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update booking'
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelBooking(bookingId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual booking cancellation in Firebase
        const index = this.bookings.findIndex(booking => booking.id === bookingId)
        if (index !== -1) {
          this.bookings[index] = {
            ...this.bookings[index],
            status: 'cancelled',
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to cancel booking'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePaymentStatus(bookingId: string, paymentStatus: PaymentStatus) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual payment status update in Firebase
        const index = this.bookings.findIndex(booking => booking.id === bookingId)
        if (index !== -1) {
          this.bookings[index] = {
            ...this.bookings[index],
            paymentStatus,
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update payment status'
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedBooking(booking: HouseBooking | null) {
      this.selectedBooking = booking
    }
  }
}) 