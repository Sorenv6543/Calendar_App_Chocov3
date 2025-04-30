import { ref, computed, watch } from "vue";
import { useTimeManagement } from "./useTimeManagement";

export function useEventForm(props, emit) {
  // Integrate time management
  const {
    selectedCheckInHour,
    selectedCheckInMinute,
    selectedCheckInPeriod,
    selectedCheckOutHour,
    selectedCheckOutMinute,
    selectedCheckOutPeriod,
    checkInTimeDialog,
    checkOutTimeDialog,
    validateHourInput,
    validateMinuteInput,
    updateCheckInTime,
    updateCheckOutTime
  } = useTimeManagement();

  // Form state as a single reactive object
  const formState = ref({
    dialog: false,
    selectedHouse: null,
    eventStartDate: props.eventStartDate || new Date().toISOString().split("T")[0],
    eventEndDate: props.eventEndDate || new Date().toISOString().split("T")[0],
    turn: false,
    turndate: "",
    turncheckintime: "",
    turncheckouttime: "",
    eventnotes: "",
    showHouseDropdown: false,
  });

  // Dialog state
  const confirmDeleteDialog = ref(false);
  const houseWarningDialog = ref(false);
  const dateWarningDialog = ref(false);
  const turnDateWarningDialog = ref(false);

  // Date picker menus
  const startDateMenu = ref(false);
  const endDateMenu = ref(false);
  const turnDateMenu = ref(false);

  // Computed values for formatted dates
  const formattedStartDate = computed(() => {
    if (!formState.value.eventStartDate) return '';
    return formatDate(formState.value.eventStartDate);
  });

  const formattedEndDate = computed(() => {
    if (!formState.value.eventEndDate) return '';
    return formatDate(formState.value.eventEndDate);
  });

  const formattedTurnDate = computed(() => {
    if (!formState.value.turndate) return '';
    return formatDate(formState.value.turndate);
  });

  // Watch for prop changes
  watch(
    () => props.modelValue,
    (val) => {
      formState.value.dialog = val;
    },
    { immediate: true }
  );

  // Watch dialog changes to emit update events
  watch(
    () => formState.value.dialog,
    (val) => {
      emit("update:modelValue", val);
      if (!val) emit("close");
    }
  );

  // Watch for changes in the event prop
  watch(
    () => props.event,
    (event) => {
      if (event) {
        loadEventData(event);
      }
    },
    { immediate: true }
  );

  // Watch for changes in the start/end date props
  watch(
    () => props.eventStartDate,
    (newDate) => {
      if (newDate && !props.event) {
        formState.value.eventStartDate = newDate;
        // Also set end date to the same date by default
        formState.value.eventEndDate = newDate;
      }
    },
    { immediate: true }
  );

  watch(
    () => props.eventEndDate,
    (newDate) => {
      if (newDate && !props.event) {
        formState.value.eventEndDate = newDate;
      }
    },
    { immediate: true }
  );

  // Methods
  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${month}/${day}/${year}`;
    } catch (e) {
      return dateString;
    }
  }

  function loadEventData(event) {
    if (!event) return;

    // Set basic event properties
    formState.value.selectedHouse = props.houses.find((h) => h.address === event.title) || null;

    // Parse dates
    const startDate = event.start ? new Date(event.start) : new Date();
    const endDate = event.end ? new Date(event.end) : new Date(startDate);

    // Format dates for form inputs (YYYY-MM-DD)
    formState.value.eventStartDate = startDate.toISOString().split("T")[0];
    formState.value.eventEndDate = endDate.toISOString().split("T")[0];

    // Set turn properties
    formState.value.turn = event.extendedProps?.turn || false;
    formState.value.turndate = event.extendedProps?.turndate || formState.value.eventStartDate;
    formState.value.turncheckintime = event.extendedProps?.turncheckintime || "";
    formState.value.turncheckouttime = event.extendedProps?.turncheckouttime || "";

    // Set event notes
    formState.value.eventnotes = event.extendedProps?.eventnotes || "";
  }

  function closeModal() {
    formState.value.dialog = false;
    emit("update:modelValue", false);
    resetForm();
  }

  function resetForm() {
    formState.value = {
      dialog: false,
      selectedHouse: null,
      eventStartDate: new Date().toISOString().split("T")[0],
      eventEndDate: new Date().toISOString().split("T")[0],
      turn: false,
      turndate: "",
      turncheckintime: "",
      turncheckouttime: "",
      eventnotes: "",
      showHouseDropdown: false,
    };
  }

  function handleTurnChange(val) {
    if (val) {
      // Ensure turndate is set to start date if not already set
      if (!formState.value.turndate) {
        formState.value.turndate = formState.value.eventStartDate;
      }

      // Set default times if not already set
      if (!formState.value.turncheckintime) {
        formState.value.turncheckintime = "12:00 PM";
      }

      if (!formState.value.turncheckouttime) {
        formState.value.turncheckouttime = "12:00 PM";
      }
    }
  }

  function toggleHouseDropdown(e) {
    // Don't toggle if in edit mode (has event)
    if (!props.event) {
      // Stop propagation to prevent document click from closing the dropdown immediately
      if (e) e.stopPropagation();
      formState.value.showHouseDropdown = !formState.value.showHouseDropdown;
    }
  }

  function selectHouse(house) {
    formState.value.selectedHouse = house;
    formState.value.showHouseDropdown = false;
  }

  function openCheckInDialog() {
    checkInTimeDialog.value = true;
  }

  function openCheckOutDialog() {
    checkOutTimeDialog.value = true;
  }

  function confirmDelete() {
    confirmDeleteDialog.value = true;
  }

  function validateEvent() {
    // House validation
    if (!formState.value.selectedHouse) {
      houseWarningDialog.value = true;
      return false;
    }

    // Date validation
    if (!formState.value.eventStartDate || !formState.value.eventEndDate) {
      dateWarningDialog.value = true;
      return false;
    }

    // Turn date validation
    if (
      formState.value.turn &&
      formState.value.turndate &&
      (formState.value.turndate < formState.value.eventStartDate ||
        formState.value.turndate > formState.value.eventEndDate)
    ) {
      turnDateWarningDialog.value = true;
      return false;
    }

    return true;
  }

  function saveEvent() {
    if (!validateEvent()) return;

    const eventData = {
      title: formState.value.selectedHouse.address,
      start: `${formState.value.eventStartDate}T00:00:00`,
      end: `${formState.value.eventEndDate}T23:59:59`,
      houseId: formState.value.selectedHouse.houseId,
      extendedProps: {
        color: formState.value.selectedHouse.color,
        eventnotes: formState.value.eventnotes || "",
        turn: formState.value.turn,
      },
    };

    if (formState.value.turn) {
      eventData.extendedProps.turndate = formState.value.turndate;
      eventData.extendedProps.turncheckintime = formState.value.turncheckintime;
      eventData.extendedProps.turncheckouttime = formState.value.turncheckouttime;
    }

    if (props.event?.id) {
      // Update existing event
      eventData.id = props.event.id;
      emit("update", eventData);
    } else {
      // Create new event
      emit("create", eventData);
    }
  }

  function deleteEvent() {
    if (props.event?.id) {
      emit("delete", props.event.id);
    }
    confirmDeleteDialog.value = false;
  }

  return {
    // State
    formState,
    confirmDeleteDialog,
    houseWarningDialog,
    dateWarningDialog,
    turnDateWarningDialog,
    startDateMenu,
    endDateMenu,
    turnDateMenu,
    checkInTimeDialog,
    checkOutTimeDialog,
    
    // Computed
    formattedStartDate,
    formattedEndDate,
    formattedTurnDate,
    
    // Methods
    closeModal,
    resetForm,
    handleTurnChange,
    toggleHouseDropdown,
    selectHouse,
    openCheckInDialog,
    openCheckOutDialog,
    confirmDelete,
    saveEvent,
    deleteEvent,
    
    // Time management
    selectedCheckInHour,
    selectedCheckInMinute,
    selectedCheckInPeriod,
    selectedCheckOutHour,
    selectedCheckOutMinute,
    selectedCheckOutPeriod,
    validateHourInput,
    validateMinuteInput,
    updateCheckInTime,
    updateCheckOutTime
  };
} 