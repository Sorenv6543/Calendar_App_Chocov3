<script setup lang="ts">
import type { Turn } from '~/types/booking'
import { useTimeManagement } from '~/composables/useTimeManagement'

const props = defineProps<{
    modelValue: boolean
    bookingId: string
    date: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', turn: Omit<Turn, 'id' | 'bookingId'>): void
}>()

const { checkInTimeDialog, checkOutTimeDialog, turncheckintime, turncheckouttime } = useTimeManagement()

// Reset form when modal opens
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        turncheckintime.value = ''
        turncheckouttime.value = ''
    }
})

// Handle form submission
const handleSubmit = () => {
    if (!turncheckintime.value || !turncheckouttime.value) {
        return
    }

    const turn: Omit<Turn, 'id' | 'bookingId'> = {
        date: props.date,
        checkInTime: turncheckintime.value,
        checkOutTime: turncheckouttime.value,
        status: 'pending'
    }

    emit('save', turn)
    emit('update:modelValue', false)
}
</script>

<template>
    <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Add Turn</h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark"
                        @click="emit('update:modelValue', false)" />
                </div>
            </template>

            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Check-in Time</label>
                        <UTimePicker v-model="turncheckintime" v-model:isVisible="checkInTimeDialog" class="mt-1" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Check-out Time</label>
                        <UTimePicker v-model="turncheckouttime" v-model:isVisible="checkOutTimeDialog" class="mt-1" />
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end space-x-2">
                    <UButton color="gray" @click="emit('update:modelValue', false)">Cancel</UButton>
                    <UButton color="primary" @click="handleSubmit">Save Turn</UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>