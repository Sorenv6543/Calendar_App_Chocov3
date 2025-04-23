<template>
  <v-dialog v-model="dialog" max-width="450px" content-class="event-modal-dialog" width="100%" :persistent="false">
    <v-card class="event-modal-card">
      <div class="modal-glass-effect"></div>

      <!-- Header with gradient -->

      <v-card-text class="modal-content">
        <!-- House Selection -->
        <div class="input-group">
          <div class="d-flex align-center mb-1">
            <v-icon color="primary" size="20">mdi-home</v-icon>
            <span class="ml-2 input-label">House</span>
          </div>
          <div class="custom-select-container">
            <div class="custom-select-header" @click="toggleHouseDropdown">
              <div class="selected-house-display">
                <div v-if="selectedHouse" class="d-flex align-center">
                  <div class="rounded-circle me-2" :style="`background-color: ${selectedHouse.color || '#2979ff'
                    }; width: 16px; height: 16px;`"></div>
                  <span>{{ selectedHouse.address }}</span>
                </div>
                <span v-else class="placeholder-text">Select a house</span>
              </div>
              <v-icon>mdi-chevron-down</v-icon>
            </div>
            <div v-if="showHouseDropdown" class="custom-select-dropdown">
              <div v-for="house in uniqueHouses" :key="house.houseId" class="house-option" @click="selectHouse(house)">
                <div class="d-flex align-center">
                  <div class="rounded-circle me-2" :style="`background-color: ${house.color || '#2979ff'
                    }; width: 16px; height: 16px;`"></div>
                  <span>{{ house.address }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Date Range -->

        <div class="date-range-container">
          <div class="input-group">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-calendar-start</v-icon>

              <span class="ml-2 input-label">Start Date</span>
            </div>

            <v-text-field v-model="eventStartDate" type="date" variant="outlined" density="comfortable"
              class="glass-input" hide-details></v-text-field>
          </div>

          <div class="input-group">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-calendar-end</v-icon>

              <span class="ml-2 input-label">End Date</span>
            </div>

            <v-text-field v-model="eventEndDate" type="date" variant="outlined" density="comfortable"
              class="glass-input" hide-details></v-text-field>
          </div>
        </div>

        <!-- Turn Section -->

        <div class="input-group turn-section">
          <v-checkbox v-model="turn" label="Add Turn" color="primary" hide-details
            @update:model-value="handleTurnChange"></v-checkbox>

          <div v-if="turn" class="turn-details mt-3">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="20">mdi-calendar-refresh</v-icon>

              <span class="ml-2 input-label">Turn Date</span>
            </div>

            <v-text-field v-model="turndate" type="date" variant="outlined" density="comfortable"
              class="glass-input mb-3" hide-details :min="eventStartDate" :max="eventEndDate"></v-text-field>

            <div class="date-range-container">
              <div class="input-group">
                <div class="d-flex align-center mb-1">
                  <v-icon color="primary" size="20">mdi-clock-in</v-icon>

                  <span class="ml-2 input-label">Check-in</span>
                </div>

                <v-text-field v-model="turncheckintime" readonly @click="openCheckInDialog" variant="outlined"
                  density="comfortable" class="glass-input time-field" hide-details></v-text-field>
              </div>

              <div class="input-group">
                <div class="d-flex align-center mb-1">
                  <v-icon color="primary" size="20">mdi-clock-out</v-icon>

                  <span class="ml-2 input-label">Check-out</span>
                </div>

                <v-text-field v-model="turncheckouttime" readonly @click="openCheckOutDialog" variant="outlined"
                  density="comfortable" class="glass-input time-field" hide-details></v-text-field>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Notes -->

        <div class="input-group">
          <div class="d-flex align-center mb-1">
            <v-icon color="primary" size="20">mdi-text-box-outline</v-icon>

            <span class="ml-2 input-label">Event Details</span>
          </div>

          <v-textarea v-model="eventnotes" variant="outlined" density="comfortable" rows="3" hide-details
            class="glass-input"></v-textarea>
        </div>
      </v-card-text>

      <v-card-actions class="modal-actions">
        <v-btn v-if="props.event" color="error" variant="outlined" @click="confirmDelete" class="delete-btn">
          <v-icon size="small" class="mr-1">mdi-delete</v-icon>

          Delete Event
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="primary" variant="elevated" @click="saveEvent" class="save-btn">
          {{ props.event ? "Update Event" : "Create Event" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirmation Dialog for Delete -->

  <v-dialog v-model="confirmDeleteDialog" max-width="400px" class="delete-dialog">
    <v-card class="delete-confirm-card">
      <v-card-title class="delete-dialog-title">
        <v-icon color="error" size="24" class="mr-2">mdi-alert-circle</v-icon>

        Confirm Delete
      </v-card-title>

      <v-card-text class="delete-dialog-text">
        Are you sure you want to delete this event? This action cannot be
        undone.
      </v-card-text>

      <v-card-actions class="delete-dialog-actions">
        <v-spacer></v-spacer>

        <v-btn color="grey" variant="text" @click="confirmDeleteDialog = false" class="cancel-btn">
          Cancel
        </v-btn>

        <v-btn color="error" variant="elevated" @click="deleteEvent" class="confirm-delete-btn">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Warning Dialog for Missing House -->
  <v-dialog v-model="houseWarningDialog" max-width="400px" class="warning-dialog">
    <v-card class="warning-confirm-card">
      <v-card-title class="warning-dialog-title">
        <v-icon color="warning" size="24" class="mr-2">mdi-alert</v-icon>
        House Required
      </v-card-title>

      <v-card-text class="warning-dialog-text">
        Please select a house to continue. Events must be associated with a house.
      </v-card-text>

      <v-card-actions class="warning-dialog-actions">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="houseWarningDialog = false" class="confirm-btn">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Warning Dialog for Date Selection -->
  <v-dialog v-model="dateWarningDialog" max-width="400px" class="warning-dialog">
    <v-card class="warning-confirm-card">
      <v-card-title class="warning-dialog-title">
        <v-icon color="warning" size="24" class="mr-2">mdi-alert</v-icon>
        Dates Required
      </v-card-title>

      <v-card-text class="warning-dialog-text">
        Please select both start and end dates for your event.
      </v-card-text>

      <v-card-actions class="warning-dialog-actions">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="dateWarningDialog = false" class="confirm-btn">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Warning Dialog for Invalid Turn Date -->
  <v-dialog v-model="turnDateWarningDialog" max-width="400px" class="warning-dialog">
    <v-card class="warning-confirm-card">
      <v-card-title class="warning-dialog-title">
        <v-icon color="warning" size="24" class="mr-2">mdi-alert</v-icon>
        Invalid Turn Date
      </v-card-title>

      <v-card-text class="warning-dialog-text">
        Turn date must be within the event date range.
      </v-card-text>

      <v-card-actions class="warning-dialog-actions">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="turnDateWarningDialog = false" class="confirm-btn">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Time Picker Components -->

  <TimePicker v-model="turncheckintime" v-model:isVisible="checkInTimeDialog" />

  <TimePicker v-model="turncheckouttime" v-model:isVisible="checkOutTimeDialog" />
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed, onMounted } from "vue";
import TimePicker from "./TimePicker.vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  event: { type: Object, default: null },
  houses: { type: Array, default: () => [] },
  eventStartDate: { type: String, default: "" },
  eventEndDate: { type: String, default: "" },
});

const emit = defineEmits(["close", "create", "update", "delete", "update:visible"]);

// State
const dialog = ref(false);
const selectedHouse = ref(null);
const eventStartDate = ref(
  props.eventStartDate || new Date().toISOString().split("T")[0]
);
const eventEndDate = ref(
  props.eventEndDate || new Date().toISOString().split("T")[0]
);
const turn = ref(false);
const turndate = ref("");
const turncheckintime = ref("");
const turncheckouttime = ref("");
const eventnotes = ref("");
const confirmDeleteDialog = ref(false);
const houseWarningDialog = ref(false);
const dateWarningDialog = ref(false);
const turnDateWarningDialog = ref(false);

// Time picker dialogs
const checkInTimeDialog = ref(false);
const checkOutTimeDialog = ref(false);

// Add to script section
const showHouseDropdown = ref(false);

// Computed property to filter out duplicate houses
const uniqueHouses = computed(() => {
  // Use a Map to ensure uniqueness by houseId first, then by normalized address
  const uniqueMap = new Map();


  props.houses.forEach((house) => {
    if (house && house.houseId && house.address) {
      // Only add if this houseId hasn't been seen before
      if (!uniqueMap.has(house.houseId)) {
        uniqueMap.set(house.houseId, house);
      }
    }
  });

  // Convert back to array and sort by address
  return Array.from(uniqueMap.values()).sort((a, b) =>
    a.address.localeCompare(b.address)
  );
});
// Watch for prop changes
watch(
  () => props.visible,
  (val) => {
    dialog.value = val;
    console.log("Modal visibility prop changed:", val);
  },
  { immediate: true }
);

// Watch dialog changes to emit update:visible events
watch(
  () => dialog.value,
  (val) => {
    console.log("Dialog state changed:", val);
    emit("update:visible", val);
    if (!val) emit("close");
  }
);

// Watch for changes in the start date prop
watch(
  () => props.eventStartDate,
  (newDate) => {
    if (newDate && !props.event) {
      // Only update if we're creating a new event (not editing)
      eventStartDate.value = newDate;
      // Also set end date to the same date by default
      eventEndDate.value = newDate;
    }
  },
  { immediate: true }
);

// Watch for changes in the end date prop
watch(
  () => props.eventEndDate,
  (newDate) => {
    if (newDate && !props.event) {
      // Only update if we're creating a new event (not editing)
      eventEndDate.value = newDate;
    }
  },
  { immediate: true }
);

watch(
  () => props.event,
  (event) => {
    if (event) {
      loadEventData(event);
    }
  },
  { immediate: true }
);

// Methods
const loadEventData = (event) => {
  if (!event) return;

  // Set basic event properties
  selectedHouse.value =
    props.houses.find((h) => h.address === event.title) || null;

  // Parse dates
  const startDate = event.start ? new Date(event.start) : new Date();
  const endDate = event.end ? new Date(event.end) : new Date(startDate);

  // Format dates for form inputs (YYYY-MM-DD)
  eventStartDate.value = startDate.toISOString().split("T")[0];
  eventEndDate.value = endDate.toISOString().split("T")[0];

  // Set turn properties
  turn.value = event.extendedProps?.turn || false;
  turndate.value = event.extendedProps?.turndate || eventStartDate.value;
  turncheckintime.value = event.extendedProps?.turncheckintime || "";
  turncheckouttime.value = event.extendedProps?.turncheckouttime || "";

  // Set event notes
  eventnotes.value = event.extendedProps?.eventnotes || "";
};

const closeModal = () => {
  console.log("closeModal called in EventModal");
  dialog.value = false;
  emit("update:visible", false);
  resetForm();
};

const resetForm = () => {
  selectedHouse.value = null;
  eventStartDate.value = new Date().toISOString().split("T")[0];
  eventEndDate.value = new Date().toISOString().split("T")[0];
  turn.value = false;
  turndate.value = "";
  turncheckintime.value = "";
  turncheckouttime.value = "";
  eventnotes.value = "";
};

const handleTurnChange = (val) => {
  if (val) {
    // Ensure turndate is set to start date if not already set
    if (!turndate.value) {
      turndate.value = eventStartDate.value;
    }
  }
};
const toggleHouseDropdown = () => {
  if (!props.event) {
    // Only toggle if not in edit mode
    showHouseDropdown.value = !showHouseDropdown.value;
  }
};

const selectHouse = (house) => {
  selectedHouse.value = house;
  showHouseDropdown.value = false;
  console.log("Selected house:", house);
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    const container = document.querySelector(".custom-select-container");
    if (container && !container.contains(e.target)) {
      showHouseDropdown.value = false;
    }
  });
});
const saveEvent = () => {
  // Validate form
  if (!selectedHouse.value) {
    houseWarningDialog.value = true;
    return;
  }

  // Validate dates
  if (!eventStartDate.value || !eventEndDate.value) {
    dateWarningDialog.value = true;
    return;
  }

  // Validate turn date is within the event date range
  if (turn.value && turndate.value) {
    if (
      turndate.value < eventStartDate.value ||
      turndate.value > eventEndDate.value
    ) {
      turnDateWarningDialog.value = true;
      return;
    }
  }

  // Create event object
  const eventData = {
    title: selectedHouse.value.address,
    start: `${eventStartDate.value}T00:00:00`,
    end: `${eventEndDate.value}T23:59:59`,
    allDay: true,
    address: selectedHouse.value.address,
    extendedProps: {
      color: selectedHouse.value.color || "#2979ff",
      eventnotes: eventnotes.value || "",
      turn: turn.value,
      turndate: turn.value ? turndate.value : null,
      turncheckintime: turn.value ? turncheckintime.value : null,
      turncheckouttime: turn.value ? turncheckouttime.value : null,
    },
  };

  // Emit the appropriate event based on whether we're editing or creating
  if (props.event) {
    emit("update", eventData);
  } else {
    emit("create", eventData);
  }

  closeModal();
};

const confirmDelete = () => {
  confirmDeleteDialog.value = true;
};

const deleteEvent = () => {
  emit("delete");
  confirmDeleteDialog.value = false;
  closeModal();
};

const openCheckInDialog = () => {
  checkInTimeDialog.value = true;
};

const openCheckOutDialog = () => {
  checkOutTimeDialog.value = true;
};

// Generate a colored dot for house selection
const getHouseColorDot = (item) => {
  if (!item || !item.color) return "";
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="${encodeURIComponent(
    item.color
  )}"/></svg>`;
};
</script>

<style scoped>
.event-modal-dialog {
  margin: 16px;
  width: 100%;
}

.event-modal-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.8);
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
      rgba(244, 197, 48, 0.25) 0%,
      rgba(65, 105, 226, 0.05) 100%);
  pointer-events: none;
  z-index: 0;
}

.modal-header {
  background: linear-gradient(135deg,
      var(--primary-color) 0%,
      var(--success-color) 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(65, 105, 226, 0.2);
}

.close-btn {
  background-color: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(4px);
  margin-right: -8px;
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
  background-color: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(65, 105, 226, 0.15) !important;
  border-radius: 10px !important;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.glass-input:hover {
  background-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 4px 10px rgba(65, 105, 226, 0.08);
  border: 1px solid rgba(65, 105, 226, 0.3) !important;
}

.time-field {
  cursor: pointer;
}

.time-field:hover {
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.date-range-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.turn-section {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(65, 105, 226, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.turn-details {
  padding-top: 8px;
  border-top: 1px solid rgba(65, 105, 226, 0.1);
}

.modal-actions {
  padding: 12px 20px 20px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
}

.delete-btn {
  border: 2px solid var(--error-color) !important;
  color: var(--error-color) !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: rgba(231, 50, 69, 0.1) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 50, 69, 0.2) !important;
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

/* Mobile Responsiveness */

@media (max-width: 600px) {
  .date-range-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .event-modal-dialog {
    margin: 12px;
  }

  .modal-content {
    padding: 16px;
    max-height: 60vh;
  }

  .modal-actions {
    padding: 12px 16px 16px;
  }
}

/* Delete Confirmation Dialog Styles */

.delete-dialog :deep(.v-card) {
  border-radius: 16px;
  overflow: hidden;
}

.delete-confirm-card {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
}

.delete-dialog-title {
  padding: 20px;
  background-color: rgba(231, 50, 69, 0.1);
  color: var(--error-color);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.delete-dialog-text {
  padding: 24px 20px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
  line-height: 1.5;
}

.delete-dialog-actions {
  padding: 12px 20px 20px;
}

.cancel-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  margin-right: 8px;
}

.confirm-delete-btn {
  background-color: var(--error-color) !important;
  color: white;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  padding: 0 20px;
  height: 36px;
}

.confirm-delete-btn:hover {
  box-shadow: 0 4px 12px rgba(231, 50, 69, 0.3) !important;
  transform: translateY(-2px);
}

.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(65, 105, 226, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ss {
  background-color: red;
}

.custom-select-header:hover {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 10px rgba(65, 105, 226, 0.08);
  border: 1px solid rgba(65, 105, 226, 0.3);
}

.aa {
  background-color: red;
}

.selected-house-display {
  flex: 1;
}



.placeholder-text {
  color: #999;
}

.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.house-option {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.house-option:hover {
  background-color: rgba(65, 105, 226, 0.1);
}

/* Warning Dialog Styles */
.warning-dialog :deep(.v-card) {
  border-radius: 16px;
  overflow: hidden;
}

.warning-confirm-card {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
}

.warning-dialog-title {
  padding: 20px;
  background-color: rgba(255, 193, 7, 0.2);
  color: #e3a008;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.warning-dialog-text {
  padding: 24px 20px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
  line-height: 1.5;
}

.warning-dialog-actions {
  padding: 12px 20px 20px;
}

.confirm-btn {
  background-color: var(--primary-color) !important;
  color: white;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  padding: 0 20px;
  height: 36px;
}

.confirm-btn:hover {
  box-shadow: 0 4px 12px rgba(65, 105, 226, 0.3) !important;
  transform: translateY(-2px);
}
</style>
