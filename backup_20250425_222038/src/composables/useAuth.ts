import { ref } from 'vue';
import { auth } from '@/firebaseConfig';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

export function useAuth() {
    const userStore = useUserStore();
    const router = useRouter();
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const initializeAuth = (): void => {
        onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                await userStore.setUserData({
                    id: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || ''
                });
            } else {
                userStore.clearUserData();
            }
        });
    };

    const signUp = async (email: string, password: string): Promise<void> => {
        loading.value = true;
        error.value = null;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await userStore.setUserData({
                id: userCredential.user.uid,
                email: userCredential.user.email || '',
                displayName: userCredential.user.displayName || ''
            });
            router.push('/');
        } catch (err) {
            error.value = 'Failed to create account';
            console.error('Error signing up:', err);
        } finally {
            loading.value = false;
        }
    };

    const signIn = async (email: string, password: string): Promise<void> => {
        loading.value = true;
        error.value = null;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await userStore.setUserData({
                id: userCredential.user.uid,
                email: userCredential.user.email || '',
                displayName: userCredential.user.displayName || ''
            });
            router.push('/');
        } catch (err) {
            error.value = 'Failed to sign in';
            console.error('Error signing in:', err);
        } finally {
            loading.value = false;
        }
    };

    const logout = async (): Promise<void> => {
        loading.value = true;
        error.value = null;

        try {
            await signOut(auth);
            userStore.clearUserData();
            router.push('/login');
        } catch (err) {
            error.value = 'Failed to sign out';
            console.error('Error signing out:', err);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        initializeAuth,
        signUp,
        signIn,
        logout
    };
} 