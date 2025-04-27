import { defineStore } from 'pinia'
import type { AuthState, LoginCredentials, RegisterData, User } from '@/models'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    authError: (state) => state.error
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual login logic with Firebase
        const user: User = {
          id: 'temp-id',
          email: credentials.email,
          displayName: 'Test User',
          role: 'user',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.user = user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred during login'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(data: RegisterData) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual registration logic with Firebase
        const user: User = {
          id: 'temp-id',
          email: data.email,
          displayName: data.displayName,
          role: 'user',
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.user = user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred during registration'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        // TODO: Implement actual logout logic with Firebase
        this.user = null
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred during logout'
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      this.loading = true
      try {
        // TODO: Implement actual auth check with Firebase
        const user = localStorage.getItem('user')
        if (user) {
          this.user = JSON.parse(user)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred during auth check'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 