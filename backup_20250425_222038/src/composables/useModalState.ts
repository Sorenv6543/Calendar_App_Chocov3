import { ref } from 'vue';

export function useModalState() {
    const showHouseModal = ref<boolean>(false);
    const showEventModal = ref<boolean>(false);
    const confirmDeleteDialog = ref<boolean>(false);
    const houseWarningDialog = ref<boolean>(false);
    const dateWarningDialog = ref<boolean>(false);
    const turnDateWarningDialog = ref<boolean>(false);

    const openHouseModal = (): void => {
        showHouseModal.value = true;
    };

    const closeHouseModal = (): void => {
        showHouseModal.value = false;
    };

    const openEventModal = (): void => {
        showEventModal.value = true;
    };

    const closeEventModal = (): void => {
        showEventModal.value = false;
    };

    const openConfirmDeleteDialog = (): void => {
        confirmDeleteDialog.value = true;
    };

    const closeConfirmDeleteDialog = (): void => {
        confirmDeleteDialog.value = false;
    };

    const openHouseWarningDialog = (): void => {
        houseWarningDialog.value = true;
    };

    const closeHouseWarningDialog = (): void => {
        houseWarningDialog.value = false;
    };

    const openDateWarningDialog = (): void => {
        dateWarningDialog.value = true;
    };

    const closeDateWarningDialog = (): void => {
        dateWarningDialog.value = false;
    };

    const openTurnDateWarningDialog = (): void => {
        turnDateWarningDialog.value = true;
    };

    const closeTurnDateWarningDialog = (): void => {
        turnDateWarningDialog.value = false;
    };

    return {
        showHouseModal,
        showEventModal,
        confirmDeleteDialog,
        houseWarningDialog,
        dateWarningDialog,
        turnDateWarningDialog,
        openHouseModal,
        closeHouseModal,
        openEventModal,
        closeEventModal,
        openConfirmDeleteDialog,
        closeConfirmDeleteDialog,
        openHouseWarningDialog,
        closeHouseWarningDialog,
        openDateWarningDialog,
        closeDateWarningDialog,
        openTurnDateWarningDialog,
        closeTurnDateWarningDialog
    };
} 