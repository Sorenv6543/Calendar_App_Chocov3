import { defineStore } from 'pinia'
import type { User, UserPreferences, UserSettings } from '@/models'

interface UserStoreState {
  currentUser: User | null
  preferences: UserPreferences | null
  settings: UserSettings | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    currentUser: null,
    preferences: null,
    settings: null,
    loading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.currentUser?.role === 'admin',
    isManager: (state) => state.currentUser?.role === 'manager',
    userPreferences: (state) => state.preferences,
    userSettings: (state) => state.settings,
    isLoading: (state) => state.loading,
    userError: (state) => state.error
  },

  actions: {
    async fetchUserProfile(userId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual user profile fetch from Firebase
        const user: User = {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'user',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.currentUser = user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch user profile'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserProfile(userId: string, updates: Partial<User>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual user profile update in Firebase
        if (this.currentUser) {
          this.currentUser = { ...this.currentUser, ...updates }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update user profile'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserPreferences(userId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual preferences fetch from Firebase
        const preferences: UserPreferences = {
          language: 'en',
          theme: 'light',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            calendarUpdates: true
          }
        }
        this.preferences = preferences
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch user preferences'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserPreferences(userId: string, updates: Partial<UserPreferences>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual preferences update in Firebase
        if (this.preferences) {
          this.preferences = { ...this.preferences, ...updates }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update user preferences'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserSettings(userId: string) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual settings fetch from Firebase
        const settings: UserSettings = {
          preferences: {
            language: 'en',
            theme: 'light',
            timezone: 'UTC',
            notifications: {
              email: true,
              push: true,
              calendarUpdates: true
            }
          },
          calendar: {
            defaultView: 'dayGridMonth',
            showWeekends: true,
            businessHours: {
              start: '09:00',
              end: '17:00'
            }
          }
        }
        this.settings = settings
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch user settings'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserSettings(userId: string, updates: Partial<UserSettings>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual settings update in Firebase
        if (this.settings) {
          this.settings = { ...this.settings, ...updates }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update user settings'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 