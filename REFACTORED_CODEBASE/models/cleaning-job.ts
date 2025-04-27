export interface CleaningJob {
  id: string
  propertyId: string
  assignedTo: {
    userId: string
    name: string
    email: string
    phone: string
  }
  schedule: {
    start: string
    end: string
    duration: number // in minutes
  }
  type: 'regular' | 'turnover' | 'deep_clean' | 'special'
  status: CleaningJobStatus
  details: {
    notes: string[]
    suppliesNeeded: string[]
    specialInstructions: string[]
    checkInTime?: string // for turnover cleanings
    checkOutTime?: string // for turnover cleanings
  }
  completion: {
    completed: boolean
    completedAt?: string
    completedBy?: string
    notes?: string
    issues?: string[]
  }
  createdAt: string
  updatedAt: string
}

export type CleaningJobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled'
export type CleaningJobType = 'regular' | 'turnover' | 'deep_clean' | 'special' 