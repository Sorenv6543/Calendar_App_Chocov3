import type { Property } from "~/types/booking";
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

export function useProperty() {
  const properties = ref<Property[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Fetch properties for a user
  const fetchProperties = async (userId: string) => {
    loading.value = true;
    try {
      const q = query(
        collection(db, "properties"),
        where("ownerId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      properties.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  // Create a new property
  const createProperty = async (property: Omit<Property, "id">) => {
    loading.value = true;
    try {
      const docRef = await addDoc(collection(db, "properties"), property);
      const newProperty: Property = {
        id: docRef.id,
        ...property,
      };
      properties.value.push(newProperty);
      return newProperty;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Update a property
  const updateProperty = async (
    propertyId: string,
    updates: Partial<Property>
  ) => {
    loading.value = true;
    try {
      const propertyRef = doc(db, "properties", propertyId);
      await updateDoc(propertyRef, updates);
      const index = properties.value.findIndex((p) => p.id === propertyId);
      if (index !== -1) {
        properties.value[index] = { ...properties.value[index], ...updates };
      }
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Delete a property
  const deleteProperty = async (propertyId: string) => {
    loading.value = true;
    try {
      await deleteDoc(doc(db, "properties", propertyId));
      properties.value = properties.value.filter((p) => p.id !== propertyId);
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
  };
}
