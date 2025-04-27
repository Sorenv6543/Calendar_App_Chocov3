<template>
  <div class="recurring-event-section">
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="d-flex align-center">
        <v-icon color="primary" size="20">mdi-repeat</v-icon>
        <span class="ml-2 input-label">Recurring Event</span>
      </div>
      <v-switch
        v-model="formState.isRecurring"
        color="primary"
        hide-details
        density="compact"
        class="ma-0 pa-0"
      ></v-switch>
    </div>

    <div v-if="formState.isRecurring" class="recurring-details mt-2">
      <div class="input-group mb-4">
        <div class="d-flex align-center mb-1">
          <span class="ml-2 input-label">Frequency</span>
        </div>
        <v-select
          v-model="formState.recurrencePattern.frequency"
          :items="frequencyOptions"
          variant="outlined"
          density="comfortable"
          class="glass-input"
          hide-details
        ></v-select>
      </div>

      <div class="input-group mb-4">
        <div class="d-flex align-center mb-1">
          <span class="ml-2 input-label">Interval</span>
        </div>
        <v-text-field
          v-model.number="formState.recurrencePattern.interval"
          type="number"
          min="1"
          variant="outlined"
          density="comfortable"
          class="glass-input"
          hide-details
        ></v-text-field>
      </div>

      <div class="input-group mb-4">
        <div class="d-flex align-center mb-1">
          <span class="ml-2 input-label">End Condition</span>
        </div>
        <v-radio-group v-model="endCondition" class="mt-0">
          <v-radio value="never" label="Never"></v-radio>
          <v-radio value="date" label="End Date">
            <template v-slot:append>
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
                    class="glass-input date-field ml-4"
                    hide-details
                    prepend-inner-icon="mdi-calendar-outline"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formState.recurrencePattern.endDate"
                  @update:model-value="endDateMenu = false"
                  color="primary"
                  :min="formState.startDate"
                ></v-date-picker>
              </v-menu>
            </template>
          </v-radio>
          <v-radio value="count" label="Number of occurrences">
            <template v-slot:append>
              <v-text-field
                v-model.number="formState.recurrencePattern.count"
                type="number"
                min="1"
                variant="outlined"
                density="comfortable"
                class="glass-input ml-4"
                hide-details
              ></v-text-field>
            </template>
          </v-radio>
        </v-radio-group>
      </div>

      <div class="recurrence-description text-caption text-medium-emphasis">
        {{ getRecurrenceDescription }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EventFormState } from '~/composables/useEventForm'
import { useRecurringEvents } from '~/composables/useRecurringEvents'

const props = defineProps<{
  formState: EventFormState
}>()

const endCondition = ref<'never' | 'date' | 'count'>('never')
const endDateMenu = ref(false)

const frequencyOptions = [
  { title: 'Daily', value: 'daily' },
  { title: 'Weekly', value: 'weekly' },
  { title: 'Monthly', value: 'monthly' },
  { title: 'Yearly', value: 'yearly' }
]

const { getRecurrenceDescription } = useRecurringEvents(computed(() => props.formState))

const formattedEndDate = computed(() => {
  if (!props.formState.recurrencePattern.endDate) return ''
  return new Date(props.formState.recurrencePattern.endDate).toLocaleDateString()
})

// Watch end condition changes
watch(endCondition, (newValue) => {
  if (newValue === 'never') {
    props.formState.recurrencePattern.endDate = null
    props.formState.recurrencePattern.count = null
  } else if (newValue === 'date') {
    props.formState.recurrencePattern.count = null
  } else if (newValue === 'count') {
    props.formState.recurrencePattern.endDate = null
  }
})
</script>

<style scoped>
.recurring-event-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.recurring-details {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 16px;
}

.recurrence-description {
  margin-top: 16px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
</style> 