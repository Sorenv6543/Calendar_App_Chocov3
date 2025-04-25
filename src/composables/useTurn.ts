import { ref } from "vue";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "~/plugins/firebase";
import type { Turn } from "~/types/booking";

export function useTurn() {
  const turns = ref<Turn[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch turns for a specific booking
  const fetchTurns = async (bookingId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const turnsQuery = query(
        collection(db, "turns"),
        where("bookingId", "==", bookingId),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(turnsQuery);
      turns.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Turn[];
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch turns";
      console.error("Error fetching turns:", err);
    } finally {
      loading.value = false;
    }
  };

  // Create a new turn
  const createTurn = async (
    bookingId: string,
    turnData: Omit<Turn, "id" | "bookingId">
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const turnRef = await addDoc(collection(db, "turns"), {
        ...turnData,
        bookingId,
      });

      const newTurn: Turn = {
        id: turnRef.id,
        bookingId,
        ...turnData,
      };

      turns.value.push(newTurn);
      return newTurn;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create turn";
      console.error("Error creating turn:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update an existing turn
  const updateTurn = async (turnId: string, turnData: Partial<Turn>) => {
    try {
      loading.value = true;
      error.value = null;

      const turnRef = doc(db, "turns", turnId);
      await updateDoc(turnRef, turnData);

      const index = turns.value.findIndex((turn) => turn.id === turnId);
      if (index !== -1) {
        turns.value[index] = {
          ...turns.value[index],
          ...turnData,
        };
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update turn";
      console.error("Error updating turn:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete a turn
  const deleteTurn = async (turnId: string) => {
    try {
      loading.value = true;
      error.value = null;

      await deleteDoc(doc(db, "turns", turnId));
      turns.value = turns.value.filter((turn) => turn.id !== turnId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete turn";
      console.error("Error deleting turn:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    turns,
    loading,
    error,
    fetchTurns,
    createTurn,
    updateTurn,
    deleteTurn,
  };
}
