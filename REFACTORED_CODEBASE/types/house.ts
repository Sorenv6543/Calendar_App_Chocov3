export interface House {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  status: HouseStatus;
  type: HouseType;
  amenities: string[];
  images: string[];
  capacity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type HouseStatus = 'active' | 'inactive' | 'maintenance' | 'deleted';
export type HouseType = 'apartment' | 'house' | 'villa' | 'condo';

export interface HouseAvailability {
  houseId: string;
  date: string;
  status: 'available' | 'booked' | 'maintenance';
  bookingId?: string;
}

export interface HouseBooking {
  id: string;
  houseId: string;
  guest: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
  };
  status: BookingStatus;
  guests: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface HouseModalProps {
  modelValue: boolean;
}

export interface HouseModalEmits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}

export interface HouseFormData {
  name: string;
  address: string;
  userId: string;
}
