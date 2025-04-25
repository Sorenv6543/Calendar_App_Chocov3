import type { CleaningSchedule, Property } from "~/types/booking";
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

export function useCleaningSchedule() {
  const schedules = ref<CleaningSchedule[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Fetch cleaning schedules for a cleaning company
  const fetchSchedules = async (cleaningCompanyId: string) => {
    loading.value = true;
    try {
      const q = query(
        collection(db, "cleaning_schedules"),
        where("cleaningCompanyId", "==", cleaningCompanyId)
      );
      const querySnapshot = await getDocs(q);
      schedules.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CleaningSchedule[];
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  // Create a new cleaning schedule
  const createSchedule = async (schedule: Omit<CleaningSchedule, "id">) => {
    loading.value = true;
    try {
      const docRef = await addDoc(
        collection(db, "cleaning_schedules"),
        schedule
      );
      const newSchedule: CleaningSchedule = {
        id: docRef.id,
        ...schedule,
      };
      schedules.value.push(newSchedule);
      return newSchedule;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Update a cleaning schedule
  const updateSchedule = async (
    scheduleId: string,
    updates: Partial<CleaningSchedule>
  ) => {
    loading.value = true;
    try {
      const scheduleRef = doc(db, "cleaning_schedules", scheduleId);
      await updateDoc(scheduleRef, updates);
      const index = schedules.value.findIndex((s) => s.id === scheduleId);
      if (index !== -1) {
        schedules.value[index] = { ...schedules.value[index], ...updates };
      }
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Delete a cleaning schedule
  const deleteSchedule = async (scheduleId: string) => {
    loading.value = true;
    try {
      await deleteDoc(doc(db, "cleaning_schedules", scheduleId));
      schedules.value = schedules.value.filter((s) => s.id !== scheduleId);
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Get all cleaning schedules for a specific date
  const getSchedulesByDate = (date: string) => {
    return schedules.value.filter((schedule) => schedule.date === date);
  };

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByDate,
  };
}
