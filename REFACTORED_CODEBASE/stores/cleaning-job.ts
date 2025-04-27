import { defineStore } from 'pinia'
import type { CleaningJob, CleaningJobStatus, CleaningJobType } from '@/models'

interface CleaningJobStoreState {
  jobs: CleaningJob[]
  selectedJob: CleaningJob | null
  loading: boolean
  error: string | null
}

export const useCleaningJobStore = defineStore('cleaning-job', {
  state: (): CleaningJobStoreState => ({
    jobs: [],
    selectedJob: null,
    loading: false,
    error: null
  }),

  getters: {
    scheduledJobs: (state) => state.jobs.filter(job => job.status === 'scheduled'),
    inProgressJobs: (state) => state.jobs.filter(job => job.status === 'in_progress'),
    completedJobs: (state) => state.jobs.filter(job => job.status === 'completed'),
    cancelledJobs: (state) => state.jobs.filter(job => job.status === 'cancelled'),
    rescheduledJobs: (state) => state.jobs.filter(job => job.status === 'rescheduled'),
    isLoading: (state) => state.loading,
    jobError: (state) => state.error,
    getJobById: (state) => (id: string) => state.jobs.find(job => job.id === id),
    getJobsByProperty: (state) => (propertyId: string) => 
      state.jobs.filter(job => job.propertyId === propertyId),
    getJobsByStaff: (state) => (userId: string) => 
      state.jobs.filter(job => job.assignedTo.userId === userId)
  },

  actions: {
    async fetchJobs() {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual jobs fetch from Firebase
        // Mock data for now
        this.jobs = []
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch cleaning jobs'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createJob(job: Omit<CleaningJob, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual job creation in Firebase
        const newJob: CleaningJob = {
          ...job,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.jobs.push(newJob)
        return newJob
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create cleaning job'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateJob(jobId: string, updates: Partial<CleaningJob>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual job update in Firebase
        const index = this.jobs.findIndex(job => job.id === jobId)
        if (index !== -1) {
          this.jobs[index] = {
            ...this.jobs[index],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update cleaning job'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateJobStatus(jobId: string, status: CleaningJobStatus) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual status update in Firebase
        const index = this.jobs.findIndex(job => job.id === jobId)
        if (index !== -1) {
          this.jobs[index] = {
            ...this.jobs[index],
            status,
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update job status'
        throw error
      } finally {
        this.loading = false
      }
    },

    async completeJob(jobId: string, completionDetails: Partial<CleaningJob['completion']>) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual job completion in Firebase
        const index = this.jobs.findIndex(job => job.id === jobId)
        if (index !== -1) {
          this.jobs[index] = {
            ...this.jobs[index],
            status: 'completed',
            completion: {
              ...this.jobs[index].completion,
              ...completionDetails,
              completed: true,
              completedAt: new Date().toISOString()
            },
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to complete cleaning job'
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedJob(job: CleaningJob | null) {
      this.selectedJob = job
    }
  }
}) 