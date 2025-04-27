import { defineStore } from 'pinia'
import type { Property, PropertyStatus, PropertyType } from '@/models'

interface PropertyStoreState {
  properties: Property[]
  selectedProperty: Property | null
  loading: boolean
  error: string | null
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyStoreState => ({
    properties: [],
    selectedProperty: null,
    loading: false,
    error: null
  }),

  getters: {
    activeProperties: (state) => state.properties.filter(property => property.status === 'active'),
    isLoading: (state) => state.loading,
    propertyError: (state) => state.error,
    getPropertyById: (state) => (id: string) => state.properties.find(property => property.id === id),
    getPropertiesByType: (state) => (type: PropertyType) => 
      state.properties.filter(property => property.type === type)
  },

  actions: {
    async fetchProperties() {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual properties fetch from Firebase
        // Mock data for now
        this.properties = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch properties'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual property creation in Firebase
        const newProperty: Property = {
          ...property,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.properties.push(newProperty)
        return newProperty
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add property'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProperty(propertyId: string, updates: Partial<Property>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual property update in Firebase
        const index = this.properties.findIndex(property => property.id === propertyId)
        if (index !== -1) {
          this.properties[index] = {
            ...this.properties[index],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update property'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProperty(propertyId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual property deletion in Firebase
        this.properties = this.properties.filter(property => property.id !== propertyId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete property'
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedProperty(property: Property | null) {
      this.selectedProperty = property
    }
  }
}) 