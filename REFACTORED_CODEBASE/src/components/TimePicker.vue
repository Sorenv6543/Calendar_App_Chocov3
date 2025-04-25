<template>
    <v-dialog :model-value="props.isVisible" @update:model-value="$emit('update:isVisible', $event)" width="400"
        content-class="time-picker-dialog">
        <v-card class="time-picker-card">
            <div class="time-picker-header">
                <v-card-title class="text-center pt-3 pb-2">Select Time</v-card-title>
            </div>
            <v-card-text>
                <div class="time-picker-container">
                    <div class="time-display">
                        <div class="time-value">{{ modelValue || "12:00 AM" }}</div>
                    </div>
                    <div class="time-dropdown-labels">
                        <div class="label-hour">Hour</div>
                        <div class="label-minute">Minute</div>
                        <div class="label-period">AM/PM</div>
                    </div>
                    <div class="time-dropdowns">
                        <v-select v-model="selectedHour" :items="hours" class="time-select hour-select" hide-details
                            density="compact" variant="outlined" @update:model-value="updateTime" />
                        <v-select v-model="selectedMinute" :items="minutes" class="time-select minute-select"
                            hide-details density="compact" variant="outlined" @update:model-value="updateTime" />
                        <v-select v-model="selectedPeriod" :items="['AM', 'PM']" class="time-select period-select"
                            hide-details density="compact" variant="outlined" @update:model-value="updateTime" />
                    </div>
                </div>
            </v-card-text>
            <v-card-actions class="time-picker-actions">
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" class="confirm-btn" @click="close">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
    modelValue: string;
    isVisible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'update:isVisible', value: boolean): void;
}>();

const hours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const selectedHour = ref<string>('12');
const selectedMinute = ref<string>('00');
const selectedPeriod = ref<'AM' | 'PM'>('AM');

// Initialize values when dialog opens
watch(() => props.isVisible, (newValue: boolean) => {
    if (newValue && props.modelValue) {
        const match = props.modelValue.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
            selectedHour.value = match[1].replace(/^0+/, '') || '12';
            selectedMinute.value = match[2];
            selectedPeriod.value = match[3].toUpperCase() as 'AM' | 'PM';
        }
    }
});

function updateTime(): void {
    emit('update:modelValue',
        `${selectedHour.value}:${selectedMinute.value} ${selectedPeriod.value}`
    );
}

function close(): void {
    emit('update:isVisible', false);
}
</script>

<style scoped>
.time-picker-dialog {
    border-radius: 16px;
    overflow: hidden;
}

.time-picker-card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.time-picker-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--success-color) 100%);
    color: white;
    padding: 8px 0;
    box-shadow: 0 2px 8px rgba(65, 105, 226, 0.2);
}

.time-picker-container {
    padding: 1.5rem;
    background-color: rgba(255, 255, 255, 0.8);
}

.time-display {
    text-align: center;
    margin-bottom: 1.5rem;
    background-color: rgba(65, 105, 226, 0.05);
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(65, 105, 226, 0.1);
}

.time-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    letter-spacing: 0.5px;
}

.time-dropdowns {
    display: flex;
    gap: 0.75rem;
}

.time-select {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.7) !important;
    border-radius: 8px !important;
    transition: all 0.2s ease;
}

.time-select:hover {
    background-color: rgba(255, 255, 255, 0.9) !important;
    box-shadow: 0 2px 8px rgba(65, 105, 226, 0.1);
}

.time-dropdown-labels {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.time-dropdown-labels>div {
    flex: 1;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
}

.time-picker-actions {
    padding: 12px 16px 16px;
    background-color: rgba(255, 255, 255, 0.9);
}

.confirm-btn {
    border-radius: 8px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    padding: 0 20px;
    height: 36px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--success-color) 100%) !important;
    box-shadow: 0 4px 12px rgba(65, 105, 226, 0.3) !important;
    transition: all 0.2s ease;
}

.confirm-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(65, 105, 226, 0.4) !important;
}

:deep(.v-btn--text) {
    color: var(--primary-color) !important;
}

:deep(.v-field--outlined) {
    border-color: rgba(65, 105, 226, 0.2) !important;
    border-radius: 8px !important;
}

:deep(.v-field--outlined:hover) {
    border-color: rgba(65, 105, 226, 0.4) !important;
}

:deep(.v-field--outlined:focus-within) {
    border-color: var(--primary-color) !important;
}

:deep(.v-field__input) {
    font-weight: 500;
    color: var(--primary-color);
}

:deep(.v-field__outline) {
    border-radius: 8px !important;
}

:deep(.v-menu__content) {
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-list-item--active) {
    background-color: rgba(65, 105, 226, 0.1) !important;
    color: var(--primary-color) !important;
}

:deep(.v-list-item:hover) {
    background-color: rgba(65, 105, 226, 0.05) !important;
}
</style>