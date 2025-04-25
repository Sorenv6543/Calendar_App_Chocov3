import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import type { Event } from "../models/calendar";

const eventsCollection = collection(db, "events");

export const eventService = {
  async fetchEvents(): Promise<Event[]> {
    const snapshot = await getDocs(eventsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event));
  },

  async addEvent(event: Omit<Event, "id">): Promise<string> {
    const docRef = await addDoc(eventsCollection, event);
    return docRef.id;
  },

  async updateEvent(id: string, event: Partial<Event>): Promise<void> {
    const eventRef = doc(eventsCollection, id);
    await updateDoc(eventRef, event);
  },

  async deleteEvent(id: string): Promise<void> {
    const eventRef = doc(eventsCollection, id);
    await deleteDoc(eventRef);
  },
};
