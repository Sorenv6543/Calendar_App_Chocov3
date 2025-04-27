import type { Store } from "pinia";

export interface UserData {
  houses?: Array<{
    houseId: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface UserStore extends Store {
  userData: UserData | null;
}

declare module "@/stores/userStore" {
  export function useUserStore(): UserStore;
}
