import type { Booking, Turn, Property } from "~/types/booking";
import { useFirestore } from "@vueuse/firebase/useFirestore";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "~/plugins/firebase";

export function useBooking() {
  const bookings = ref<Booking[]>([]);
  const turns = ref<Turn[]>([]);
  const properties = ref<Property[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Fetch bookings for a property
  const fetchBookings = async (propertyId: string) => {
    loading.value = true;
    try {
      const q = query(
        collection(db, "bookings"),
        where("propertyId", "==", propertyId)
      );
      const querySnapshot = await getDocs(q);
      bookings.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  // Create a new booking
  const createBooking = async (booking: Omit<Booking, "id">) => {
    loading.value = true;
    try {
      const docRef = await addDoc(collection(db, "bookings"), booking);
      const newBooking: Booking = {
        id: docRef.id,
        ...booking,
      };
      bookings.value.push(newBooking);
      return newBooking;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Add a turn to a booking
  const addTurn = async (
    bookingId: string,
    turn: Omit<Turn, "id" | "bookingId">
  ) => {
    loading.value = true;
    try {
      const newTurn: Turn = {
        id: crypto.randomUUID(),
        bookingId,
        ...turn,
      };
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        turn: newTurn,
      });
      turns.value.push(newTurn);
      return newTurn;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Update a booking
  const updateBooking = async (
    bookingId: string,
    updates: Partial<Booking>
  ) => {
    loading.value = true;
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, updates);
      const index = bookings.value.findIndex((b) => b.id === bookingId);
      if (index !== -1) {
        bookings.value[index] = { ...bookings.value[index], ...updates };
      }
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Delete a booking
  const deleteBooking = async (bookingId: string) => {
    loading.value = true;
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      bookings.value = bookings.value.filter((b) => b.id !== bookingId);
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    bookings,
    turns,
    properties,
    loading,
    error,
    fetchBookings,
    createBooking,
    addTurn,
    updateBooking,
    deleteBooking,
  };
}
