export interface Property {
  id: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  location?: {
    latitude: number
    longitude: number
  }
  type: 'residential' | 'commercial' | 'vacation_rental' | 'hotel'
  cleaningRequirements: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom'
    customFrequency?: string
    specialInstructions: string[]
    requiredSupplies: string[]
    estimatedDuration: number // in minutes
  }
  contact: {
    name: string
    email: string
    phone: string
    preferredContactMethod: 'email' | 'phone' | 'text'
  }
  accessInstructions: string
  colorCode: string // for calendar display
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export type PropertyStatus = 'active' | 'inactive'
export type PropertyType = 'residential' | 'commercial' | 'vacation_rental' | 'hotel'
export type CleaningFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom' 