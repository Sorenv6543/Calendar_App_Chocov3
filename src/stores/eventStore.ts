import { defineStore } from "pinia";
import { useUserStore } from "./userStore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define interface for Event
export interface Event {
  id?: string;
  userId: string;
  title: string;
  start: string;
  end: string;
  houseId?: string;
  description?: string;
  extendedProps?: {
    eventnotes?: string;
    turn?: boolean;
    turndate?: string;
    turncheckintime?: string;
    turncheckouttime?: string;
    color?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const useEventStore = defineStore("event", {
  state: () => ({
    events: [] as Event[],
    cachedEvents: {} as Record<string, Event[]>, // Cache events by month-year
    isLoading: false,
    error: null as string | null,
    activeSubscriptions: new Map<string, Function>(), // Track active event subscriptions
  }),

  actions: {
    /**
     * Fetch events for a specific date range
     */
    async fetchEvents(startStr: string, endStr: string): Promise<Event[]> {
      this.isLoading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        if (!userStore.userData?.id) {
          throw new Error("No user is logged in");
        }

        // Cache key based on date range (month-year)
        const startDate = new Date(startStr);
        const cacheKey = `${startDate.getMonth()}-${startDate.getFullYear()}`;

        // Check if we have this period cached
        if (this.cachedEvents[cacheKey]) {
          return this.cachedEvents[cacheKey];
        }

        const eventsRef = collection(db, "events");
        const q = query(
          eventsRef,
          where("userId", "==", userStore.userData.id)
        );

        const querySnapshot = await getDocs(q);
        const events: Event[] = [];

        querySnapshot.forEach((doc) => {
          const eventData = doc.data() as Event;
          events.push({
            id: doc.id,
            ...eventData
          });
        });

        // Store in cache
        this.cachedEvents[cacheKey] = events;
        
        return events;
      } catch (err: any) {
        console.error("Failed to fetch events:", err);
        this.error = "Failed to fetch events: " + err.message;
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Subscribe to real-time events updates
     */
    subscribeToEvents() {
      const userStore = useUserStore();
      if (!userStore.userData?.id) return;

      // Unsubscribe from any existing subscription
      this.unsubscribeFromEvents();

      const eventsRef = collection(db, "events");
      const q = query(
        eventsRef,
        where("userId", "==", userStore.userData.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const eventData = { id: change.doc.id, ...change.doc.data() } as Event;
          
          if (change.type === "added") {
            this.events.push(eventData);
          } else if (change.type === "modified") {
            const index = this.events.findIndex(e => e.id === eventData.id);
            if (index !== -1) {
              this.events[index] = eventData;
            }
          } else if (change.type === "removed") {
            this.events = this.events.filter(e => e.id !== eventData.id);
          }
        });
        
        // Clear cache on any change
        this.cachedEvents = {};
      });

      // Store the subscription
      this.activeSubscriptions.set('events', unsubscribe);
    },

    /**
     * Unsubscribe from events updates
     */
    unsubscribeFromEvents() {
      if (this.activeSubscriptions.has('events')) {
        const unsubscribe = this.activeSubscriptions.get('events');
        if (unsubscribe) unsubscribe();
        this.activeSubscriptions.delete('events');
      }
    },

    /**
     * Create a new event
     */
    async createEvent(eventData: Partial<Event>): Promise<Event> {
      this.isLoading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        if (!userStore.userData?.id) {
          throw new Error("No user is logged in");
        }

        // Ensure userId is set
        eventData.userId = userStore.userData.id;

        // Add to events collection
        const docRef = await addDoc(collection(db, "events"), eventData);

        // Create the complete event with ID
        const newEvent = {
          id: docRef.id,
          ...eventData
        } as Event;

        // Clear cache to force reload
        this.cachedEvents = {};

        return newEvent;
      } catch (err: any) {
        console.error("Failed to create event:", err);
        this.error = "Failed to create event: " + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update an existing event
     */
    async updateEvent(eventData: Partial<Event>): Promise<boolean> {
      this.isLoading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        if (!userStore.userData?.id) {
          throw new Error("No user is logged in");
        }
        
        if (!eventData.id) {
          throw new Error("Event ID is required for updates");
        }

        // Create a copy of the event data without the id field
        const { id, ...updateData } = eventData;

        // Update the event in Firestore
        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, updateData);

        // Clear cache to force reload
        this.cachedEvents = {};

        return true;
      } catch (err: any) {
        console.error("Failed to update event:", err);
        this.error = "Failed to update event: " + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete an event
     */
    async deleteEvent(eventId: string): Promise<boolean> {
      this.isLoading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        if (!userStore.userData?.id) {
          throw new Error("No user is logged in");
        }

        const eventRef = doc(db, "events", eventId);
        await deleteDoc(eventRef);

        // Clear cache to force reload
        this.cachedEvents = {};

        return true;
      } catch (err: any) {
        console.error("Failed to delete event:", err);
        this.error = "Failed to delete event: " + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
}); 