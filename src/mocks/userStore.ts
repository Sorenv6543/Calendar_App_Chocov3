import { HouseData } from '../types/calendar';

// Mock implementation of User Store
export const useUserStore = () => {
  const userData = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    houses: [
      { 
        houseId: 'house1', 
        name: 'Test House 1',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        checkInTime: '14:00',
        checkOutTime: '11:00'
      },
      { 
        houseId: 'house2', 
        name: 'Test House 2',
        address: '456 Test Ave',
        city: 'Test Town',
        country: 'Test Nation',
        checkInTime: '15:00',
        checkOutTime: '10:00'
      }
    ] as HouseData[]
  };

  return {
    userData,
    loading: false,
    error: null,
    fetchUserData: () => Promise.resolve(userData),
    updateUserData: () => Promise.resolve(),
    setCurrentUser: () => {}
  };
}; 