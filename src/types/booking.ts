export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  color: string; // For calendar display
  contactNumber?: string;
  cleaningCompanyId?: string; // Reference to assigned cleaning company
}

export interface Booking {
  id: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  turn?: Turn;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
}

export interface Turn {
  id: string;
  bookingId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: "pending" | "completed";
}

export interface CleaningSchedule {
  id: string;
  propertyId: string;
  date: string;
  checkOutTime: string;
  status: "pending" | "completed";
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  role: "property_owner" | "cleaning_company";
  name: string;
  properties?: Property[]; // For property owners
  assignedProperties?: Property[]; // For cleaning companies
}
