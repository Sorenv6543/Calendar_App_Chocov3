import { defineStore } from 'pinia'

interface ModalState {
  isOpen: boolean
  component: string | null
  props: Record<string, any>
}

interface UIStoreState {
  modals: Record<string, ModalState>
  loadingStates: Record<string, boolean>
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  error: string | null
}

export const useUIStore = defineStore('ui', {
  state: (): UIStoreState => ({
    modals: {},
    loadingStates: {},
    theme: 'light',
    sidebarOpen: true,
    error: null
  }),

  getters: {
    isModalOpen: (state) => (modalId: string) => state.modals[modalId]?.isOpen || false,
    isLoading: (state) => (loadingId: string) => state.loadingStates[loadingId] || false,
    currentTheme: (state) => state.theme,
    isSidebarOpen: (state) => state.sidebarOpen,
    uiError: (state) => state.error
  },

  actions: {
    openModal(modalId: string, component: string, props: Record<string, any> = {}) {
      this.modals[modalId] = {
        isOpen: true,
        component,
        props
      }
    },

    closeModal(modalId: string) {
      if (this.modals[modalId]) {
        this.modals[modalId].isOpen = false
      }
    },

    setLoading(loadingId: string, isLoading: boolean) {
      this.loadingStates[loadingId] = isLoading
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    setSidebarOpen(isOpen: boolean) {
      this.sidebarOpen = isOpen
    },

    clearError() {
      this.error = null
    },

    setError(error: string) {
      this.error = error
    }
  }
}) 