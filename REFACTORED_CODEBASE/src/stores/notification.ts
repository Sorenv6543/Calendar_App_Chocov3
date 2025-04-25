import { defineStore } from 'pinia'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  timestamp: string
}

interface NotificationStoreState {
  notifications: Notification[]
  loading: boolean
  error: string | null
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationStoreState => ({
    notifications: [],
    loading: false,
    error: null
  }),

  getters: {
    activeNotifications: (state) => state.notifications,
    isLoading: (state) => state.loading,
    notificationError: (state) => state.error
  },

  actions: {
    addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }
      this.notifications.push(newNotification)

      // Auto-remove notification after duration if specified
      if (notification.duration) {
        setTimeout(() => {
          this.removeNotification(newNotification.id)
        }, notification.duration)
      }
    },

    removeNotification(id: string) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },

    clearNotifications() {
      this.notifications = []
    },

    addSuccess(message: string, duration?: number) {
      this.addNotification({
        type: 'success',
        message,
        duration
      })
    },

    addError(message: string, duration?: number) {
      this.addNotification({
        type: 'error',
        message,
        duration
      })
    },

    addWarning(message: string, duration?: number) {
      this.addNotification({
        type: 'warning',
        message,
        duration
      })
    },

    addInfo(message: string, duration?: number) {
      this.addNotification({
        type: 'info',
        message,
        duration
      })
    }
  }
}) 