import type { Auth } from "firebase/auth";

declare module "@/auth" {
  export const auth: Auth;
}
