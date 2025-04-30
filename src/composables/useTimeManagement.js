import { ref } from "vue";

export function useTimeManagement() {
  const selectedCheckInHour = ref("12");
  const selectedCheckInMinute = ref("00");
  const selectedCheckInPeriod = ref("AM");
  const selectedCheckOutHour = ref("12");
  const selectedCheckOutMinute = ref("00");
  const selectedCheckOutPeriod = ref("PM");

  const checkInTimeDialog = ref(false);
  const checkOutTimeDialog = ref(false);
  const turncheckintime = ref("");
  const turncheckouttime = ref("");

  function validateHourInput(value, fieldName) {
    let numericValue = value.replace(/[^0-9]/g, "");
    let num = parseInt(numericValue);
    if (isNaN(num) || num < 1) {
      num = 1;
    } else if (num > 12) {
      num = 12;
    }

    if (fieldName === "checkIn") {
      selectedCheckInHour.value = num.toString();
    } else {
      selectedCheckOutHour.value = num.toString();
    }
  }

  function validateMinuteInput(value, fieldName) {
    let numericValue = value.replace(/[^0-9]/g, "");
    let num = parseInt(numericValue);
    if (isNaN(num)) {
      num = 0;
    } else if (num > 59) {
      num = 59;
    }

    let formattedValue = num.toString().padStart(2, "0");
    if (fieldName === "checkIn") {
      selectedCheckInMinute.value = formattedValue;
    } else {
      selectedCheckOutMinute.value = formattedValue;
    }
  }

  function updateCheckInTime() {
    turncheckintime.value = `${selectedCheckInHour.value}:${selectedCheckInMinute.value} ${selectedCheckInPeriod.value}`;
  }

  function updateCheckOutTime() {
    turncheckouttime.value = `${selectedCheckOutHour.value}:${selectedCheckOutMinute.value} ${selectedCheckOutPeriod.value}`;
  }

  return {
    selectedCheckInHour,
    selectedCheckInMinute,
    selectedCheckInPeriod,
    selectedCheckOutHour,
    selectedCheckOutMinute,
    selectedCheckOutPeriod,
    checkInTimeDialog,
    checkOutTimeDialog,
    turncheckintime,
    turncheckouttime,
    validateHourInput,
    validateMinuteInput,
    updateCheckInTime,
    updateCheckOutTime,
  };
}
