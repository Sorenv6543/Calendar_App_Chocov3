<template>
  <div class="date-range-container">
    <div class="input-group">
      <div class="d-flex align-center mb-1">
        <v-icon color="primary" size="20">mdi-calendar-outline</v-icon>
        <span class="ml-2 input-label">Check-In</span>
      </div>
      <v-menu
        v-model="startDateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        min-width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="formattedStartDate"
            readonly
            variant="outlined"
            density="comfortable"
            class="glass-input date-field"
            hide-details
            prepend-inner-icon="mdi-calendar-outline"
            v-bind="props"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="formState.startDate"
          @update:model-value="startDateMenu = false"
          color="primary"
        ></v-date-picker>
      </v-menu>
    </div>

    <div class="input-group">
      <div class="d-flex align-center mb-1">
        <v-icon color="primary" size="20">mdi-calendar-outline</v-icon>
        <span class="ml-2 input-label">Check-Out</span>
      </div>
      <v-menu
        v-model="endDateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        min-width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="formattedEndDate"
            readonly
            variant="outlined"
            density="comfortable"
            class="glass-input date-field"
            hide-details
            prepend-inner-icon="mdi-calendar-outline"
            v-bind="props"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="formState.endDate"
          @update:model-value="endDateMenu = false"
          color="primary"
          :min="formState.startDate"
        ></v-date-picker>
      </v-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EventFormState } from '~/composables/useEventForm'

const props = defineProps<{
  formState: EventFormState
}>()

const startDateMenu = ref(false)
const endDateMenu = ref(false)

const formattedStartDate = computed(() => {
  if (!props.formState.startDate) return ''
  return formatDate(props.formState.startDate)
})

const formattedEndDate = computed(() => {
  if (!props.formState.endDate) return ''
  return formatDate(props.formState.endDate)
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
</script>

<style scoped>
.date-range-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .date-range-container {
    grid-template-columns: 1fr;
  }
}

.date-field {
  cursor: pointer;
}

.date-field:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style> 