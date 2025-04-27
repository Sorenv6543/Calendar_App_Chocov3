import { ref, computed } from 'vue';
import type { House } from '@/types/house';
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useUserStore } from '@/stores/userStore';

export function useHouse() {
    const userStore = useUserStore();
    const houses = ref<House[]>([]);
    const selectedHouseId = ref<string | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const selectedHouse = computed(() => {
        return houses.value.find(house => house.id === selectedHouseId.value) || null;
    });

    const fetchHouses = async () => {
        loading.value = true;
        error.value = null;
        try {
            const q = query(collection(db, 'houses'));
            const querySnapshot = await getDocs(q);
            houses.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as House));
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch houses';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const createHouse = async (houseData: Omit<House, 'id'>) => {
        loading.value = true;
        error.value = null;
        try {
            const docRef = await addDoc(collection(db, 'houses'), {
                ...houseData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            houses.value.push({
                id: docRef.id,
                ...houseData
            });

            return docRef.id;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create house';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateHouse = async (houseId: string, updates: Partial<House>) => {
        loading.value = true;
        error.value = null;
        try {
            const houseRef = doc(db, 'houses', houseId);
            await updateDoc(houseRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });

            const index = houses.value.findIndex(h => h.id === houseId);
            if (index !== -1) {
                houses.value[index] = {
                    ...houses.value[index],
                    ...updates
                };
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update house';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteHouse = async (houseId: string) => {
        loading.value = true;
        error.value = null;
        try {
            await deleteDoc(doc(db, 'houses', houseId));
            houses.value = houses.value.filter(h => h.id !== houseId);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete house';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const setSelectedHouse = (houseId: string | null) => {
        selectedHouseId.value = houseId;
    };

    return {
        houses,
        selectedHouse,
        selectedHouseId,
        loading,
        error,
        fetchHouses,
        createHouse,
        updateHouse,
        deleteHouse,
        setSelectedHouse
    };
} 