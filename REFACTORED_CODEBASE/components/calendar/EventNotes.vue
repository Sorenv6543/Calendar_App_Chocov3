<template>
  <div class="input-group">
    <div class="d-flex align-center mb-1">
      <v-icon color="primary" size="20">mdi-text-box-outline</v-icon>
      <span class="ml-2 input-label">Event Details</span>
    </div>

    <v-textarea
      v-model="formState.eventNotes"
      variant="outlined"
      density="comfortable"
      rows="3"
      hide-details
      class="glass-input"
      placeholder="Add any additional details about the event..."
    ></v-textarea>
  </div>
</template>

<script setup lang="ts">
import type { EventFormState } from '~/composables/useEventForm'

defineProps<{
  formState: EventFormState
}>()
</script>

<style scoped>
.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.glass-input:hover {
  background: rgba(255, 255, 255, 0.08);
}

.glass-input:focus-within {
  background: rgba(255, 255, 255, 0.1);
}
</style> 