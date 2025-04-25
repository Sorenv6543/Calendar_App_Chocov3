<script setup lang="ts">
import type { CleaningSchedule, Property } from '~/types/booking'
import { useCleaningSchedule } from '~/composables/useCleaningSchedule'
import { useProperty } from '~/composables/useProperty'
import { useUserStore } from '~/stores/userStore'

const userStore = useUserStore()
const { schedules, loading: schedulesLoading, error: schedulesError, fetchSchedules, createSchedule, updateSchedule, deleteSchedule, getSchedulesByDate } = useCleaningSchedule()
const { properties, loading: propertiesLoading, error: propertiesError, fetchProperties } = useProperty()

// Selected date for the calendar view
const selectedDate = ref<string>('')
const selectedProperty = ref<Property | null>(null)

// Fetch schedules and properties on mount
onMounted(async () => {
    if (userStore.user?.id) {
        await fetchSchedules(userStore.user.id)
        await fetchProperties(userStore.user.id)
    }
})

// Handle schedule creation
const handleCreateSchedule = async (schedule: Omit<CleaningSchedule, 'id' | 'cleaningCompanyId'>) => {
    if (userStore.user?.id) {
        await createSchedule({
            ...schedule,
            cleaningCompanyId: userStore.user.id
        })
    }
}

// Handle schedule update
const handleUpdateSchedule = async (scheduleId: string, updates: Partial<CleaningSchedule>) => {
    await updateSchedule(scheduleId, updates)
}

// Handle schedule deletion
const handleDeleteSchedule = async (scheduleId: string) => {
    await deleteSchedule(scheduleId)
}

// Get schedules for the selected date
const schedulesForSelectedDate = computed(() => {
    if (selectedDate.value) {
        return getSchedulesByDate(selectedDate.value)
    }
    return []
})
</script>

<template>
    <div class="dashboard-container">
        <!-- Calendar Section -->
        <div class="calendar-section">
            <h2>Cleaning Schedule</h2>
            <div class="calendar-container">
                <FullCalendar :events="schedules" :editable="true" :selectable="true"
                    @dateSelect="(date) => selectedDate = date" @eventClick="handleDeleteSchedule" />
            </div>
        </div>

        <!-- Schedule List Section -->
        <div class="schedule-section">
            <h2>Today's Cleaning Schedule</h2>
            <div v-if="schedulesForSelectedDate.length > 0" class="schedule-list">
                <div v-for="schedule in schedulesForSelectedDate" :key="schedule.id" class="schedule-card">
                    <div class="schedule-info">
                        <h3>{{ schedule.propertyId }}</h3>
                        <p>Check-out Time: {{ schedule.checkOutTime }}</p>
                        <p>Status: {{ schedule.status }}</p>
                    </div>
                    <div class="schedule-actions">
                        <UButton @click="handleUpdateSchedule(schedule.id, { status: 'completed' })" color="green"
                            variant="ghost">
                            Mark Complete
                        </UButton>
                        <UButton @click="handleDeleteSchedule(schedule.id)" color="red" variant="ghost">
                            Delete
                        </UButton>
                    </div>
                </div>
            </div>
            <div v-else class="no-schedules">
                <p>No cleaning schedules for the selected date</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-container {
    @apply p-4 space-y-6;
}

.calendar-section {
    @apply space-y-4;
}

.calendar-container {
    @apply h-[600px];
}

.schedule-section {
    @apply space-y-4;
}

.schedule-list {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.schedule-card {
    @apply p-4 border rounded-lg shadow-sm;
}

.schedule-info {
    @apply space-y-2;
}

.schedule-actions {
    @apply mt-4 flex justify-end space-x-2;
}

.no-schedules {
    @apply text-center py-8 text-gray-500;
}
</style>