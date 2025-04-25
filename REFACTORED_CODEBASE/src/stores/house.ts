import { defineStore } from 'pinia'
import type {
  House,
  HouseStatus,
  HouseAvailability,
  HouseBooking,
  BookingStatus,
  PaymentStatus
} from '@/models'

interface HouseStoreState {
  houses: House[]
  selectedHouse: House | null
  houseAvailability: Record<string, HouseAvailability[]>
  houseBookings: Record<string, HouseBooking[]>
  loading: boolean
  error: string | null
}

export const useHouseStore = defineStore('house', {
  state: (): HouseStoreState => ({
    houses: [],
    selectedHouse: null,
    houseAvailability: {},
    houseBookings: {},
    loading: false,
    error: null
  }),

  getters: {
    activeHouses: (state) => state.houses.filter(house => house.status === 'active'),
    isLoading: (state) => state.loading,
    houseError: (state) => state.error,
    getHouseById: (state) => (id: string) => state.houses.find(house => house.id === id),
    getHouseAvailability: (state) => (houseId: string) => state.houseAvailability[houseId] || [],
    getHouseBookings: (state) => (houseId: string) => state.houseBookings[houseId] || []
  },

  actions: {
    async fetchHouses() {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual houses fetch from Firebase
        // Mock data for now
        this.houses = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch houses'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addHouse(house: Omit<House, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual house creation in Firebase
        const newHouse: House = {
          ...house,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.houses.push(newHouse)
        return newHouse
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add house'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateHouse(houseId: string, updates: Partial<House>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual house update in Firebase
        const index = this.houses.findIndex(house => house.id === houseId)
        if (index !== -1) {
          this.houses[index] = {
            ...this.houses[index],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update house'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteHouse(houseId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual house deletion in Firebase
        this.houses = this.houses.filter(house => house.id !== houseId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete house'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchHouseAvailability(houseId: string, startDate: string, endDate: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual availability fetch from Firebase
        // Mock data for now
        this.houseAvailability[houseId] = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch house availability'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchHouseBookings(houseId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual bookings fetch from Firebase
        // Mock data for now
        this.houseBookings[houseId] = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch house bookings'
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedHouse(house: House | null) {
      this.selectedHouse = house
    }
  }
}) 