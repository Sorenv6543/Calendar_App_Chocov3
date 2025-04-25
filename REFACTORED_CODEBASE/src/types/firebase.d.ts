import type { Firestore } from "firebase/firestore";

declare module "@/firebaseConfig" {
  export const db: Firestore;
}
