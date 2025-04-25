<script setup lang="ts">
import type { Property, Booking, Turn } from '~/types/booking'
import { useBooking } from '~/composables/useBooking'
import { useProperty } from '~/composables/useProperty'
import { useUserStore } from '~/stores/userStore'

const userStore = useUserStore()
const { properties, loading: propertiesLoading, error: propertiesError, fetchProperties, createProperty, deleteProperty } = useProperty()
const { bookings, loading: bookingsLoading, error: bookingsError, fetchBookings, createBooking, addTurn, deleteBooking } = useBooking()

// Selected property for the calendar view
const selectedProperty = ref<Property | null>(null)

// Fetch properties and bookings on mount
onMounted(async () => {
    if (userStore.user?.id) {
        await fetchProperties(userStore.user.id)
        if (properties.value.length > 0) {
            selectedProperty.value = properties.value[0]
            await fetchBookings(selectedProperty.value.id)
        }
    }
})

// Watch for property selection changes
watch(selectedProperty, async (newProperty) => {
    if (newProperty) {
        await fetchBookings(newProperty.id)
    }
})

// Handle property creation
const handleCreateProperty = async (property: Omit<Property, 'id' | 'ownerId'>) => {
    if (userStore.user?.id) {
        await createProperty({
            ...property,
            ownerId: userStore.user.id
        })
    }
}

// Handle property deletion
const handleDeleteProperty = async (propertyId: string) => {
    await deleteProperty(propertyId)
    if (selectedProperty.value?.id === propertyId) {
        selectedProperty.value = properties.value[0] || null
    }
}

// Handle booking creation
const handleCreateBooking = async (booking: Omit<Booking, 'id' | 'propertyId'>) => {
    if (selectedProperty.value) {
        await createBooking({
            ...booking,
            propertyId: selectedProperty.value.id
        })
    }
}

// Handle turn creation
const handleAddTurn = async (bookingId: string, turn: Omit<Turn, 'id' | 'bookingId'>) => {
    await addTurn(bookingId, turn)
}

// Handle booking deletion
const handleDeleteBooking = async (bookingId: string) => {
    await deleteBooking(bookingId)
}
</script>

<template>
    <div class="dashboard-container">
        <!-- Property Management Section -->
        <div class="property-section">
            <h2>My Properties</h2>
            <div class="property-list">
                <div v-for="property in properties" :key="property.id" class="property-card">
                    <div class="property-info">
                        <h3>{{ property.name }}</h3>
                        <p>{{ property.address }}</p>
                    </div>
                    <div class="property-actions">
                        <UButton @click="handleDeleteProperty(property.id)" color="red" variant="ghost">
                            Delete
                        </UButton>
                    </div>
                </div>
            </div>
            <UButton @click="$emit('openPropertyModal')" color="primary">
                Add New Property
            </UButton>
        </div>

        <!-- Calendar Section -->
        <div class="calendar-section">
            <h2>Booking Calendar</h2>
            <div v-if="selectedProperty" class="calendar-container">
                <FullCalendar :events="bookings" :editable="true" :selectable="true" @dateSelect="handleCreateBooking"
                    @eventClick="handleDeleteBooking" />
            </div>
            <div v-else class="no-property-selected">
                <p>Please select or create a property to view the calendar</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-container {
    @apply p-4 space-y-6;
}

.property-section {
    @apply space-y-4;
}

.property-list {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.property-card {
    @apply p-4 border rounded-lg shadow-sm;
}

.property-info {
    @apply space-y-2;
}

.property-actions {
    @apply mt-4 flex justify-end;
}

.calendar-section {
    @apply space-y-4;
}

.calendar-container {
    @apply h-[600px];
}

.no-property-selected {
    @apply text-center py-8 text-gray-500;
}
</style>