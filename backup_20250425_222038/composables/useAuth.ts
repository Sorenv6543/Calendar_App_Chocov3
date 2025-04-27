import { ref } from 'vue'

export const useAuth = () => {
  const isAuthenticated = ref(false)

  const login = async (email: string, password: string) => {
    // TODO: Implement actual authentication
    isAuthenticated.value = true
  }

  const logout = async () => {
    // TODO: Implement actual logout
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    login,
    logout
  }
} 