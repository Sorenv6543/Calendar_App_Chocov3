<template>
  <v-dialog v-model="dialog" max-width="450px" content-class="event-modal-dialog" width="100%" :persistent="false"
    transition="fade-transition" origin="center center">
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
            <div class="custom-select-header" @click.stop="toggleHouseDropdown"
              :class="{ 'disabled': props.event, 'active': !props.event }">
              <div class="selected-house-display">
                <div v-if="selectedHouse" class="d-flex align-center">
                  <div class="rounded-circle me-2" :style="`background-color: ${selectedHouse.color || '#2979ff'
                    }; width: 16px; height: 16px;`"></div>
                  <span>{{ selectedHouse.address }}</span>
                </div>
                <span v-else class="placeholder-text">{{ props.event ? "No house associated" : "Click to select a house"
                }}</span>
              </div>
              <v-icon v-if="!props.event" color="primary">mdi-chevron-down</v-icon>
            </div>
            <div v-if="showHouseDropdown" class="custom-select-dropdown">
              <div v-for="house in uniqueHouses" :key="house.houseId" class="house-option"
                @click.stop="selectHouse(house)">
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

              <span class="ml-2 input-label text-medium-emphasis">Check-In</span>
            </div>

            <v-menu v-model="startDateMenu" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" min-width="auto">
              <template v-slot:activator="{ props }">
                <v-text-field v-model="formattedStartDate" readonly variant="outlined" density="comfortable"
                  class="glass-input date-field" hide-details prepend-inner-icon="mdi-calendar-outline"
                  v-bind="props"></v-text-field>
              </template>
              <v-date-picker v-model="eventStartDate" @update:model-value="startDateMenu = false"
                color="primary"></v-date-picker>
            </v-menu>
          </div>

          <div class="input-group">
            <div class="d-flex align-center mb-1">

              <span class="ml-2 input-label">Check-Out</span>
            </div>

            <v-menu v-model="endDateMenu" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" min-width="auto">
              <template v-slot:activator="{ props }">
                <v-text-field v-model="formattedEndDate" readonly variant="outlined" density="comfortable"
                  class="glass-input date-field" hide-details prepend-inner-icon="mdi-calendar-outline"
                  v-bind="props"></v-text-field>
              </template>
              <v-date-picker v-model="eventEndDate" @update:model-value="endDateMenu = false" color="primary"
                :min="eventStartDate"></v-date-picker>
            </v-menu>
          </div>
        </div>

        <!-- Turn Section -->
        <div class="input-group turn-section">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <v-icon color="primary" size="20">mdi-clock-outline</v-icon>
              <span class="ml-2 input-label">Turn</span>
            </div>
            <v-switch v-model="turn" color="primary" hide-details density="compact"
              @update:model-value="handleTurnChange" class="ma-0 pa-0"></v-switch>
          </div>

          <div v-if="turn" class="turn-details mt-2">
            <div class="d-flex align-center mb-1">

              <span class="ml-2 input-label">Turn Date</span>
            </div>

            <v-menu v-model="turnDateMenu" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" min-width="auto">
              <template v-slot:activator="{ props }">
                <v-text-field v-model="formattedTurnDate" readonly variant="outlined" density="comfortable"
                  class="glass-input date-field mb-2" hide-details prepend-inner-icon="mdi-calendar-outline"
                  placeholder="Select turn date" v-bind="props"></v-text-field>
              </template>
              <v-date-picker v-model="turndate" @update:model-value="turnDateMenu = false" color="primary"
                :min="eventStartDate" :max="eventEndDate"></v-date-picker>
            </v-menu>

            <div class="date-range-container">
              <div class="input-group">
                <div class="d-flex align-center mb-1">
                  <v-icon color="primary" size="20">mdi-clock-outline</v-icon>
                  <span class="ml-2 input-label">Check-in</span>
                </div>

                <v-text-field v-model="turncheckintime" readonly @click="openCheckInDialog" variant="outlined"
                  density="comfortable" class="glass-input time-field" placeholder="12:00 PM"
                  hide-details></v-text-field>
              </div>

              <div class="input-group">
                <div class="d-flex align-center mb-1">
                  <v-icon color="primary" size="20">mdi-clock-outline</v-icon>
                  <span class="ml-2 input-label">Check-out</span>
                </div>

                <v-text-field v-model="turncheckouttime" readonly @click="openCheckOutDialog" variant="outlined"
                  density="comfortable" class="glass-input time-field" placeholder="12:00 PM"
                  hide-details></v-text-field>
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
import { ref, defineProps, defineEmits, watch, computed, onMounted, nextTick, onBeforeUnmount } from "vue";
import TimePicker from "./TimePicker.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  event: { type: Object, default: null },
  houses: { type: Array, default: () => [] },
  eventStartDate: { type: String, default: "" },
  eventEndDate: { type: String, default: "" },
});

const emit = defineEmits(["close", "create", "update", "delete", "update:modelValue"]);

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

// Date picker menus
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const turnDateMenu = ref(false);

// Time picker dialogs
const checkInTimeDialog = ref(false);
const checkOutTimeDialog = ref(false);

// Formatted dates for display
const formattedStartDate = computed(() => {
  if (!eventStartDate.value) return '';
  return formatDate(eventStartDate.value);
});

const formattedEndDate = computed(() => {
  if (!eventEndDate.value) return '';
  return formatDate(eventEndDate.value);
});

const formattedTurnDate = computed(() => {
  if (!turndate.value) return '';
  return formatDate(turndate.value);
});

// Date formatting function
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  } catch (e) {
    return dateString;
  }
}

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
  () => props.modelValue,
  (val) => {
    dialog.value = val;

    // If opening modal for new event (not editing), ensure house dropdown is highlighted
    if (val && !props.event) {
      // Use nextTick to wait for DOM to update
      nextTick(() => {
        const selectHeader = document.querySelector('.custom-select-header');
        if (selectHeader) {
          selectHeader.classList.add('active');
          // Use CSS animation instead of chained setTimeout
          selectHeader.classList.add('initial-highlight');
        }
      });
    }
  },
  { immediate: true }
);

// Watch dialog changes to emit update:modelValue events
watch(
  () => dialog.value,
  (val) => {
    emit("update:modelValue", val);
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
  dialog.value = false;
  emit("update:modelValue", false);
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

    // Set default times if not already set
    if (!turncheckintime.value) {
      turncheckintime.value = "12:00 PM";
    }

    if (!turncheckouttime.value) {
      turncheckouttime.value = "12:00 PM";
    }
  }
};

const toggleHouseDropdown = (e) => {
  // Don't toggle if in edit mode (has event)
  if (!props.event) {
    // Stop propagation to prevent document click from closing the dropdown immediately
    if (e) e.stopPropagation();

    showHouseDropdown.value = !showHouseDropdown.value;

    // If we're opening the dropdown, add highlight effect via CSS
    if (showHouseDropdown.value) {
      const selectHeader = document.querySelector('.custom-select-header');
      if (selectHeader) {
        selectHeader.classList.add('highlight-pulse');
      }
    }
  }
};

const selectHouse = (house, e) => {
  // Stop propagation to prevent document click handler
  if (e) e.stopPropagation();

  selectedHouse.value = house;
  showHouseDropdown.value = false;
};

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (e) => {
    const container = document.querySelector(".custom-select-container");
    const dropdown = document.querySelector(".custom-select-dropdown");

    // Only proceed if dropdown is open and click is outside the container and not on a house option
    if (
      showHouseDropdown.value &&
      container &&
      !container.contains(e.target) &&
      dropdown &&
      !dropdown.contains(e.target) &&
      !e.target.classList.contains('house-option')
    ) {
      showHouseDropdown.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  // Clean up event listener on component unmount
  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
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

  // Add one day to end date to make it exclusive (required by FullCalendar)
  const endDate = new Date(eventEndDate.value);
  endDate.setDate(endDate.getDate() + 1);
  const exclusiveEndDate = endDate.toISOString().split('T')[0];

  // Create event object
  const eventData = {
    title: selectedHouse.value.address,
    start: `${eventStartDate.value}T00:00:00`,
    end: `${exclusiveEndDate}T00:00:00`, // Use exclusive end date for proper multi-day rendering
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
  font-weight: 00;
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
  background-color: rgba(240, 245, 255, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 8px 12px;
  border: 1px solid rgba(65, 105, 226, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.turn-details {
  padding-top: 6px;
  border-top: 1px solid rgba(65, 105, 226, 0.15);
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
  background-color: rgba(250, 252, 255, 0.7);
  border: 1px solid rgba(65, 105, 226, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-select-header.active {
  border: 1px solid rgba(65, 105, 226, 0.5);
  background-color: rgba(240, 245, 255, 0.8);
  box-shadow: 0 2px 8px rgba(65, 105, 226, 0.1);
}

.custom-select-header.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: rgba(245, 247, 250, 0.6);
}

.custom-select-header:not(.disabled):hover {
  background-color: rgba(240, 245, 255, 0.9);
  box-shadow: 0 4px 10px rgba(65, 105, 226, 0.15);
  border: 1px solid rgba(65, 105, 226, 0.5);
  transform: translateY(-1px);
}

.selected-house-display {
  flex: 1;
}

.placeholder-text {
  color: #4169e2;
  font-weight: 500;
}

.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(65, 105, 226, 0.15);
  margin-top: 5px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(65, 105, 226, 0.3);
  animation: dropdownFade 0.2s ease-in-out;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  background-color: rgba(65, 105, 226, 0.15);
  color: var(--primary-color);
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

.highlight-pulse {
  animation: highlightPulse 1s ease-in-out;
  border-color: rgba(65, 105, 226, 0.8) !important;
}

.initial-highlight {
  animation: highlightPulse 1s ease-in-out;
  border-color: rgba(65, 105, 226, 0.8) !important;
}

/* Fade transition for dialog */
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.2s ease;
}

.fade-transition-enter-from,
.fade-transition-leave-to {
  opacity: 0;
}

.house-option {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid rgba(65, 105, 226, 0.05);
}

.house-option:last-child {
  border-bottom: none;
}

.house-option:hover {
  background-color: rgba(65, 105, 226, 0.08);
}

@keyframes highlightPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(65, 105, 226, 0.5);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(65, 105, 226, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(65, 105, 226, 0);
  }
}

/* Added styles for date fields */
.date-field::-webkit-calendar-picker-indicator {
  display: none;
}

/* Update to more thorough approach to remove calendar icons */
.date-field {
  position: relative;
}

.date-field :deep(input[type="date"]) {
  position: relative;
}

.date-field :deep(input[type="date"])::-webkit-calendar-picker-indicator,
.date-field :deep(input[type="date"])::-webkit-inner-spin-button {
  display: none !important;
  -webkit-appearance: none !important;
  opacity: 0 !important;
  position: absolute;
  right: 0;
  pointer-events: none;
  z-index: -1;
}

.date-field :deep(input[type="date"])::-webkit-clear-button {
  display: none !important;
}

/* For Firefox */
.date-field :deep(input[type="date"]) {
  -moz-appearance: textfield;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
