import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock firebase modules
vi.mock('@/auth', () => ({
  auth: {},
  onAuthStateChangedListener: vi.fn(),
  logoutUser: vi.fn()
}))

vi.mock('@/user-utils', () => ({
  fetchUserData: vi.fn().mockResolvedValue(() => {})
}))

vi.mock('@/firebaseConfig', () => ({
  db: {}
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-event-id' })
}))

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct state', () => {
    const store = useUserStore()
    expect(store.userData).toBe(null)
    expect(store.isLoading).toBe(true)
    expect(store.error).toBe(null)
    expect(store.houses).toEqual([])
    expect(store.selectedHouse).toBe(null)
    expect(store.selectedHouseId).toBe(null)
  })

  it('generates a house ID of correct length', () => {
    const store = useUserStore()
    const id = store.generateHouseId(10)
    expect(id.length).toBe(10)
  })

  it('selects a house correctly', () => {
    const store = useUserStore()
    const mockHouse = { houseId: 'test123', address: '123 Test St' }
    
    store.selectHouse(mockHouse)
    
    expect(store.selectedHouse).toEqual(mockHouse)
    expect(store.selectedHouseId).toBe('test123')
  })
}) 