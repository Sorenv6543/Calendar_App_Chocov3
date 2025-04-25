/**
 * Represents a property in the system
 */
export interface Property {
  /** Unique identifier for the property */
  id: string;
  /** ID of the property owner */
  ownerId: string;
  /** Name of the property */
  name: string;
  /** Full address of the property */
  address: string;
  /** Color code for calendar display */
  color: string;
  /** Optional contact number for the property */
  contactNumber?: string;
  /** Optional ID of the assigned cleaning company */
  cleaningCompanyId?: string;
}
