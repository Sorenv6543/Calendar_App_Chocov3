
// const showHouseDropdown = ref(false);
// const turndate = ref('');
// const turncheckintime = ref('');
// const turncheckouttime = ref(null);
// const turn = ref(false);
// const eventnotes = ref('');
// const isEventNotesFocused = ref(false);
// const eventcolor = ref('#66b8ca');
// const selectedEvent = ref(null); //to hold event data for editModal


// const calendarOptions = {
//   // ... other options
//   eventDidMount: (info) => {
//     info.el.style.backgroundColor = info.event.extendedProps.color;
//   },
//   eventClick: (info) => {  // Update selectedEvent when clicking
//     selectedEvent.value = info.event;
//     isEditEventModalVisible.value = true;
//   },

// };

// watch(selectedHouse, () => { // Watch selectedHouse to close dropdown
//   showHouseDropdown.value = false;
// });



// // ... (fetchEvents, handleDateSelect remain unchanged)

// async function handleCreateEvent() {
//   // ... (existing code)

//   const newEvent = {
//     // ... other properties
//     extendedProps: {
//       // ... other extended properties
//       turncheckintime: turn.value ? turncheckintime.value : null,
//       turncheckouttime: turn.value ? turncheckouttime.value : null, // Correctly set turncheckouttime
//       // ...
//     },
//   };

//   try {
//     const docRef = await addDoc(collection(db, 'events'), newEvent);
//     newEvent.id = docRef.id; // Assign Firebase ID after successful add

//     calendarRef.value.getApi().addEvent(newEvent); // Use the complete event
//     closeModal();
//     // ... rest of try block
//   } catch (error) {
//     // ...
//   }
// }



// function selectHouse(house) {
//   selectedHouse.value = house;
//  showHouseDropdown.value = false;
// }

// // ... (other functions: addEvent, handleEventUpdate, updateEventInFirebase, deleteEvent, handleEventResize remain unchanged)
// </script>