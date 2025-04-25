<!--Script---------->

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "../stores/userStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: false,
  }
});

/**
 * EVENT/PROP PATTERN - MODAL COMPONENT
 * 
 * This modal component follows Vue best practices:
 * 1. It doesn't emit entity events (like houseAdded) - store handles that
 * 2. It only emits UI events (close, visibility changes)
 * 3. Parent component (Home.vue) is the single source of truth for visibility
 * 4. Prevents duplicate modals and duplicate event emissions
 */
const emit = defineEmits(["close", "update:modelValue", "closeModal"]);

const userStore = useUserStore();

const formData = ref({
  address: "",
  color: "#66b8ca", // Default color
});

const isSubmitting = ref(false);
const errorMessage = ref("");
const isVisible = ref(false);

// Simplified watcher logic - use a single watcher
watch(
  [() => props.modelValue, () => props.isVisible],
  ([modelValue, visible]) => {
    // Update internal state without emitting back
    isVisible.value = modelValue || visible;
  },
  { immediate: true }
);

// Only emit when our internal state changes
watch(
  () => isVisible.value,
  (val) => {
    if (val !== props.modelValue) {
      emit("update:modelValue", val);
    }
  }
);

const createHouse = async () => {
  if (!formData.value.address) {
    errorMessage.value = "Address is required.";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    /**
     * STATE MANAGEMENT SEPARATION
     * 
     * 1. Create house through store (persistence layer)
     * 2. Don't emit specific entity events (house added)
     * 3. The store update will trigger reactivity in parent components
     * 4. This avoids duplicate houses in the UI
     */
    const newHouse = await userStore.createHouse(formData.value);

    // Don't emit event anymore - rely on store to update UI
    // emit("houseAdded", newHouse);

    // Close modal
    close();
  } catch (error) {
    console.error("Error creating house:", error);
    errorMessage.value = "Failed to add house. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  // Set internal state first
  isVisible.value = false;

  // Reset form data
  formData.value = { address: "", color: "#66b8ca" };
  errorMessage.value = "";

  // Emit events in a single batch
  emit("close");
  emit("closeModal");
  emit("update:modelValue", false);
};
</script>

<!--Template----------->

<template>
  <v-dialog v-model="isVisible" max-width="450px" content-class="house-modal-dialog" width="100%"
    transition="fade-transition" origin="center center">
    <v-card class="house-modal-card">
      <div class="modal-glass-effect"></div>

      <v-card-text class="modal-content">
        <!-- House Form -->
        <div class="input-group">
          <div class="d-flex align-center mb-1">
            <v-icon color="primary" size="20">mdi-home</v-icon>
            <span class="ml-2 input-label">Property Address</span>
          </div>
          <v-text-field v-model="formData.address" variant="outlined" density="comfortable" class="glass-input"
            placeholder="Enter property address" hide-details="auto" required></v-text-field>
        </div>

        <div class="input-group">
          <div class="d-flex align-center mb-1">
            <v-icon color="primary" size="20">mdi-palette</v-icon>
            <span class="ml-2 input-label">House Color</span>
          </div>

          <div class="d-flex color-selection-container">
            <div class="selected-color-preview" :style="`background-color: ${formData.color}`"></div>
            <div class="compact-color-swatches">
              <v-color-picker v-model="formData.color" hide-inputs hide-canvas show-swatches :swatches="[
                ['#66b8ca', '#4169e2', '#8656c3', '#e5564e', '#F4C530'],
                ['#3CB371', '#FF7F50', '#6A5ACD', '#20B2AA', '#FF69B4']
              ]"></v-color-picker>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message mt-3">
          <v-alert type="error" variant="tonal" density="compact">
            {{ errorMessage }}
          </v-alert>
        </div>
      </v-card-text>

      <v-card-actions class="modal-actions">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="close" class="cancel-btn">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="createHouse" :loading="isSubmitting" class="save-btn">
          Add House
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<!--Style----------->

<style scoped>
.house-modal-dialog {
  margin: 16px;
  width: 100%;
}

.house-modal-card {
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

.modal-glass-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(65, 105, 226, 0.05) 0%,
      rgba(255, 255, 255, 0.95) 100%);
  pointer-events: none;
  z-index: 0;
}

.modal-content {
  padding: 20px;
  position: relative;
  z-index: 1;
  max-height: 70vh;
  overflow-y: auto;
}

.input-group {
  margin-bottom: 16px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}

.glass-input {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(65, 105, 226, 0.12) !important;
  border-radius: 12px !important;
  transition: all 0.2s ease;
  margin-top: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.glass-input:hover {
  background-color: #ffffff !important;
  box-shadow: 0 2px 5px rgba(65, 105, 226, 0.06) !important;
  border: 1px solid rgba(65, 105, 226, 0.25) !important;
}

.modal-actions {
  padding: 12px 20px 20px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  border-radius: 10px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  padding: 0 20px;
  height: 40px;
  background: linear-gradient(135deg,
      var(--primary-color) 0%,
      var(--success-color) 100%) !important;
  box-shadow: 0 4px 15px rgba(65, 105, 226, 0.3) !important;
  transition: all 0.2s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(65, 105, 226, 0.4) !important;
}

.cancel-btn {
  margin-right: 8px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}

.color-selection-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(65, 105, 226, 0.12);
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.selected-color-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 12px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-color-picker {
  width: 100%;
  max-width: 280px;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

.compact-color-swatches :deep(.v-color-picker-swatches) {
  max-width: 280px;
}

.compact-color-swatches :deep(.v-color-picker__controls) {
  display: none;
}
</style>
