// Mock implementation of Firebase Auth
export const auth = {
  currentUser: {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User'
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(auth.currentUser);
    return () => {}; // Return unsubscribe function
  },
  signOut: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve({ user: auth.currentUser }),
  signInWithPopup: () => Promise.resolve({ user: auth.currentUser })
}; 