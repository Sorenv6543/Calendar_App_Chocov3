export interface House {
  id: string;
  name: string;
  address: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HouseModalProps {
  modelValue: boolean;
}

export interface HouseModalEmits {
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
  (
    e: "create",
    house: Omit<House, "id" | "createdAt" | "updatedAt">
  ): Promise<void>;
}
