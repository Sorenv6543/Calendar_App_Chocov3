<template>
  <div class="input-group turn-section">
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="d-flex align-center">
        <v-icon color="primary" size="20">mdi-clock-outline</v-icon>
        <span class="ml-2 input-label">Turn</span>
      </div>
      <v-switch
        v-model="formState.turn"
        color="primary"
        hide-details
        density="compact"
        class="ma-0 pa-0"
        @update:model-value="handleTurnChange"
      ></v-switch>
    </div>

    <div v-if="formState.turn" class="turn-details mt-2">
      <div class="d-flex align-center mb-1">
        <v-icon color="primary" size="20">mdi-calendar-outline</v-icon>
        <span class="ml-2 input-label">Turn Date</span>
      </div>

      <v-menu
        v-model="turnDateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        min-width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="formattedTurnDate"
            readonly
            variant="outlined"
            density="comfortable"
            class="glass-input date-field mb-2"
            hide-details
            prepend-inner-icon="mdi-calendar-outline"
            placeholder="Select turn date"
            v-bind="props"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="formState.turnDate"
          @update:model-value="turnDateMenu = false"
          color="primary"
          :min="formState.startDate"
          :max="formState.endDate"
        ></v-date-picker>
      </v-menu>

      <div class="date-range-container">
        <div class="input-group">
          <div class="d-flex align-center mb-1">
            <v-icon color="primary" size="20">mdi-clock-outline</v-icon>
            <span class="ml-2 input-label">Check-in</span>
          </div>

          <v-text-field
            v-model="formState.turnCheckInTime"
            readonly
            @click="openCheckInDialog"
            variant="outlined"
            density="comfortable"
            class="glass-input time-field"
            placeholder="12:00 PM"
            hide-details
          ></v-text-field>
        </div>

        <div class="input-group">
          <div class="d-flex align-center mb-1">
            <v-icon color="primary" size="20">mdi-clock-outline</v-icon>
            <span class="ml-2 input-label">Check-out</span>
          </div>

          <v-text-field
            v-model="formState.turnCheckOutTime"
            readonly
            @click="openCheckOutDialog"
            variant="outlined"
            density="comfortable"
            class="glass-input time-field"
            placeholder="12:00 PM"
            hide-details
          ></v-text-field>
        </div>
      </div>
    </div>
  </div>

  <!-- Time Picker Components -->
  <TimePicker
    v-model="formState.turnCheckInTime"
    v-model:isVisible="checkInTimeDialog"
  />
  <TimePicker
    v-model="formState.turnCheckOutTime"
    v-model:isVisible="checkOutTimeDialog"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TimePicker from './TimePicker.vue'
import type { EventFormState } from '~/composables/useEventForm'

const props = defineProps<{
  formState: EventFormState
}>()

const turnDateMenu = ref(false)
const checkInTimeDialog = ref(false)
const checkOutTimeDialog = ref(false)

const formattedTurnDate = computed(() => {
  if (!props.formState.turnDate) return ''
  return formatDate(props.formState.turnDate)
})

function formatDate(dateString: string): string {
  if (!dateString) return ''
  try {
    const [year, month, day] = dateString.split('-')
    return `${month}/${day}/${year}`
  } catch (e) {
    return dateString
  }
}

const handleTurnChange = (val: boolean) => {
  if (val) {
    // Ensure turndate is set to start date if not already set
    if (!props.formState.turnDate) {
      props.formState.turnDate = props.formState.startDate
    }

    // Set default times if not already set
    if (!props.formState.turnCheckInTime) {
      props.formState.turnCheckInTime = '12:00 PM'
    }

    if (!props.formState.turnCheckOutTime) {
      props.formState.turnCheckOutTime = '12:00 PM'
    }
  }
}

const openCheckInDialog = () => {
  checkInTimeDialog.value = true
}

const openCheckOutDialog = () => {
  checkOutTimeDialog.value = true
}
</script>

<style scoped>
.turn-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.turn-details {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 16px;
}

.date-range-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .date-range-container {
    grid-template-columns: 1fr;
  }
}

.time-field {
  cursor: pointer;
}

.time-field:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style> 