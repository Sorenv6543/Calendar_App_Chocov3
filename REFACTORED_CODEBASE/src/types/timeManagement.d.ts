export interface TimeManagement {
  checkInTimeDialog: boolean;
  checkOutTimeDialog: boolean;
  turncheckintime: string;
  turncheckouttime: string;
  updateCheckInTime: (time: string) => void;
  updateCheckOutTime: (time: string) => void;
}

declare module "@/composables/useTimeManagement" {
  export function useTimeManagement(): TimeManagement;
}
