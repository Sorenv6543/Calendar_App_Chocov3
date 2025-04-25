<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Property } from '~/types/property'
import type { Booking } from '~/types/booking'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'save': [booking: Booking]
}>()

const properties = ref<Property[]>([])
const selectedProperty = ref<Property | null>(null)
const checkInDate = ref<string>('')
const checkOutDate = ref<string>('')
const eventDetails = ref('')
const isTurnEnabled = ref(false)
const turnDate = ref('')
const checkInTime = ref('12:00 PM')
const checkOutTime = ref('12:00 PM')

const { fetchProperties } = useProperty()
const { createBooking } = useBooking()

// Reset form when modal opens
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        selectedProperty.value = null
        checkInDate.value = ''
        checkOutDate.value = ''
        eventDetails.value = ''
        isTurnEnabled.value = false
        turnDate.value = ''
        checkInTime.value = '12:00 PM'
        checkOutTime.value = '12:00 PM'
        loadProperties()
    }
})

async function loadProperties() {
    try {
        properties.value = await fetchProperties()
    } catch (error) {
        console.error('Error loading properties:', error)
    }
}

async function handleSubmit() {
    if (!selectedProperty.value || !checkInDate.value || !checkOutDate.value) {
        return
    }

    const bookingData: Booking = {
        propertyId: selectedProperty.value.id,
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value,
        details: eventDetails.value,
        hasTurn: isTurnEnabled.value,
        turn: isTurnEnabled.value ? {
            date: turnDate.value,
            checkInTime: checkInTime.value,
            checkOutTime: checkOutTime.value
        } : null
    }

    try {
        await createBooking(bookingData)
        emit('update:modelValue', false)
        emit('save', bookingData)
    } catch (error) {
        console.error('Error creating booking:', error)
    }
}
</script>

<template>
    <UModal v-model="modelValue" :ui="{ width: 'sm:max-w-lg' }">
        <div class="p-4 space-y-6">
            <!-- House Selection -->
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-home" class="text-primary-500" />
                    <h3 class="text-base font-medium">House</h3>
                </div>
                <USelectMenu v-model="selectedProperty" :options="properties" option-attribute="name"
                    placeholder="Click to select a house" searchable class="w-full">
                    <template #option="{ option: property }">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full" :class="property.color" />
                            <span>{{ property.name }}</span>
                        </div>
                    </template>
                </USelectMenu>
            </div>

            <!-- Check-in/Check-out Dates -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm mb-1">Check-In</label>
                    <UInput v-model="checkInDate" type="date" class="w-full" />
                </div>
                <div>
                    <label class="block text-sm mb-1">Check-Out</label>
                    <UInput v-model="checkOutDate" type="date" class="w-full" />
                </div>
            </div>

            <!-- Turn Section -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-clock" class="text-primary-500" />
                        <span class="text-base">Turn</span>
                    </div>
                    <USwitch v-model="isTurnEnabled" />
                </div>

                <div v-if="isTurnEnabled" class="space-y-4">
                    <div>
                        <label class="block text-sm mb-1">Turn Date</label>
                        <UInput v-model="turnDate" type="date" class="w-full" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm mb-1">Check-in</label>
                            <UInput v-model="checkInTime" type="time" class="w-full" />
                        </div>
                        <div>
                            <label class="block text-sm mb-1">Check-out</label>
                            <UInput v-model="checkOutTime" type="time" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Event Details -->
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-document-text" class="text-primary-500" />
                    <label class="text-base">Event Details</label>
                </div>
                <UTextarea v-model="eventDetails" rows="4" class="w-full" />
            </div>

            <!-- Create Event Button -->
            <div class="pt-2">
                <UButton color="primary" :disabled="!selectedProperty || !checkInDate || !checkOutDate"
                    @click="handleSubmit" class="w-full">
                    Create Event
                </UButton>
            </div>
        </div>
    </UModal>
</template>

<style scoped>
.u-input,
.u-textarea {
    @apply bg-white dark:bg-gray-800;
}
</style>