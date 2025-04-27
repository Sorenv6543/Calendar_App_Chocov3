<template>
    <v-dialog v-model="dialog" max-width="450px" content-class="event-modal-dialog" width="100%">
        <v-card class="event-modal-card">
            <div class="modal-glass-effect"></div>

            <!-- Header with gradient -->
            <v-card-title class="modal-header">
                <div class="d-flex align-center">
                    <v-icon color="white" class="mr-2">mdi-calendar-edit</v-icon>
                    <span>{{ isEditing ? 'Edit Event' : 'Create New Event' }}</span>
                </div>
                <v-btn icon small @click="closeModal" class="close-btn">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="modal-content">
                <!-- House Selection -->
                <div class="input-group">
                    <div class="d-flex align-center mb-1">
                        <v-icon color="primary" size="20">mdi-home</v-icon>
                        <span class="ml-2 input-label">House</span>
                    </div>
                    <v-menu v-model="houseMenuOpen" :close-on-content-click="true" location="bottom" :z-index="9999"
                        transition="none" open-on-click>
                        <template v-slot:activator="{ props }">
                            <v-text-field v-model="selectedHouseDisplay" readonly outlined dense hide-details
                                class="glass-input" :loading="userStore.isLoading" :disabled="userStore.isLoading"
                                v-bind="props" append-icon="mdi-menu-down"
                                @click="console.log('Houses:', houses.value)"></v-text-field>
                        </template>
                        <v-card class="house-menu pa-2">
                            <v-list v-if="houses.length > 0">
                                <v-list-item v-for="house in houses" :key="house.houseId"
                                    @click="selectHouseItem(house)" class="house-item" color="primary">
                                    <v-list-item-title>{{ house.address }}</v-list-item-title>
                                    <v-list-item-subtitle class="text-caption">
                                        <div class="d-flex align-center">
                                            <div class="color-dot mr-2" :style="{ backgroundColor: house.color }"></div>
                                            {{ house.color }}
                                        </div>
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </v-list>
                            <div v-else class="pa-4 text-center text-subtitle-1 text-grey">
                                No houses available
                            </div>
                        </v-card>
                    </v-menu>
                </div>

                <!-- Date Range -->
                <div class="date-range-container">
                    <div class="input-group">
                        <div class="d-flex align-center mb-1">
                            <v-icon color="primary" size="20">mdi-calendar-start</v-icon>
                            <span class="ml-2 input-label">Start Date</span>
                        </div>
                        <v-menu v-model="startDateMenu" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="290px">
                            <template v-slot:activator="{ props }">
                                <v-text-field v-model="startDate" readonly outlined dense hide-details
                                    class="glass-input" v-bind="props"></v-text-field>
                            </template>
                            <v-date-picker v-model="startDate" color="primary"
                                @update:model-value="startDateMenu = false"></v-date-picker>
                        </v-menu>
                    </div>

                    <div class="input-group">
                        <div class="d-flex align-center mb-1">
                            <v-icon color="primary" size="20">mdi-calendar-end</v-icon>
                            <span class="ml-2 input-label">End Date</span>
                        </div>
                        <v-menu v-model="endDateMenu" :close-on-content-click="false" transition="scale-transition"
                            offset-y min-width="290px">
                            <template v-slot:activator="{ props }">
                                <v-text-field v-model="endDate" readonly outlined dense hide-details class="glass-input"
                                    v-bind="props"></v-text-field>
                            </template>
                            <v-date-picker v-model="endDate" color="primary"
                                @update:model-value="endDateMenu = false"></v-date-picker>
                        </v-menu>
                    </div>
                </div>

                <!-- Event Details -->
                <div class="input-group">
                    <div class="d-flex align-center mb-1">
                        <v-icon color="primary" size="20">mdi-text-box</v-icon>
                        <span class="ml-2 input-label">Event Details</span>
                    </div>
                    <v-textarea v-model="eventDetails" outlined dense hide-details rows="3"
                        class="glass-input"></v-textarea>
                </div>

                <!-- Color Selection -->
                <div class="input-group">
                    <div class="d-flex align-center mb-1">
                        <v-icon color="primary" size="20">mdi-palette</v-icon>
                        <span class="ml-2 input-label">Event Color</span>
                    </div>
                    <div class="color-picker-container">
                        <div v-for="color in eventColors" :key="color" class="color-option"
                            :class="{ 'selected': selectedColor === color }" :style="{ backgroundColor: color }"
                            @click="selectedColor = color"></div>
                    </div>
                </div>
            </v-card-text>

            <v-card-actions class="modal-actions">
                <v-btn text color="grey darken-1" class="cancel-btn" @click="closeModal">
                    Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="create-btn" @click="saveEvent">
                    <v-icon left>mdi-check</v-icon>
                    {{ isEditing ? 'Update Event' : 'Create Event' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUserStore } from "../stores/userStore";

interface House {
    houseId: string;
    address: string;
    color: string;
}

interface Event {
    id: number;
    houseId: string | null;
    houseName: string;
    startDate: string;
    endDate: string;
    details: string;
    color: string;
}

interface Props {
    value: boolean;
    editEvent: Event | null;
}

const props = withDefaults(defineProps<Props>(), {
    value: true,
    editEvent: null
});

const emit = defineEmits<{
    (e: 'input', value: boolean): void;
    (e: 'close'): void;
    (e: 'save', event: Event): void;
}>();

const userStore = useUserStore();

// Fix the houses computed property
const houses = computed<House[]>(() => {
    if (!userStore.userData?.houses) return [];
    return userStore.userData.houses;
});

// Initialize store on mount
onMounted(async (): Promise<void> => {
    console.log('Component mounted, initializing auth listener');
    if (!userStore.userData) {
        await userStore.initAuthListener();
    }
});

watch(() => userStore.isLoading, (loading: boolean) => {
    console.log('Loading state changed:', loading);
});

watch(() => userStore.userData, (userData) => {
    console.log('UserData changed:', userData);
});

const dialog = ref<boolean>(props.value);
const isEditing = ref<boolean>(false);
const selectedHouse = ref<string | null>(null);
const startDate = ref<string>(new Date().toISOString().substr(0, 10));
const endDate = ref<string>(new Date().toISOString().substr(0, 10));
const startDateMenu = ref<boolean>(false);
const endDateMenu = ref<boolean>(false);
const eventDetails = ref<string>('');
const selectedColor = ref<string>('#6200ea');
const houseMenuOpen = ref<boolean>(false);

const eventColors = [
    '#6200ea', // Purple
    '#2979ff', // Blue
    '#00e676', // Green
    '#ffab00', // Amber
    '#ff3d00', // Red/Orange
    '#d500f9', // Magenta
    '#00bfa5', // Teal
    '#ff6d00'  // Orange
];

const resetForm = (): void => {
    isEditing.value = false;
    selectedHouse.value = null;
    startDate.value = new Date().toISOString().substr(0, 10);
    endDate.value = new Date().toISOString().substr(0, 10);
    eventDetails.value = '';
    selectedColor.value = '#6200ea';
};

watch(() => props.value, (val: boolean) => {
    dialog.value = val;
});

watch(() => dialog.value, (val: boolean) => {
    emit('input', val);
    if (!val) {
        emit('close');
    }
});

watch(() => props.editEvent, (event: Event | null) => {
    if (event) {
        isEditing.value = true;
        selectedHouse.value = event.houseId || null;
        startDate.value = event.startDate || new Date().toISOString().substr(0, 10);
        endDate.value = event.endDate || new Date().toISOString().substr(0, 10);
        eventDetails.value = event.details || '';
        selectedColor.value = event.color || '#6200ea';
    } else {
        resetForm();
    }
}, { immediate: true });

const closeModal = (): void => {
    dialog.value = false;
    resetForm();
};

const saveEvent = (): void => {
    const eventData: Event = {
        id: isEditing.value && props.editEvent ? props.editEvent.id : Date.now(),
        houseId: selectedHouse.value,
        houseName: houses.value.find(h => h.houseId === selectedHouse.value)?.address || '',
        startDate: startDate.value,
        endDate: endDate.value,
        details: eventDetails.value,
        color: selectedColor.value
    };

    emit('save', eventData);
    closeModal();
};

const selectedHouseDisplay = computed<string>(() => {
    if (!selectedHouse.value || !houses.value) return '';
    const selected = houses.value.find(h => h.houseId === selectedHouse.value);
    return selected ? selected.address : '';
});

const selectHouseItem = (house: House): void => {
    console.log('Selecting house:', house);
    selectedHouse.value = house.houseId;
    houseMenuOpen.value = false;
};

// Debug watchers
watch(() => userStore.userData, (newData) => {
    console.log('UserData changed:', newData?.houses);
}, { immediate: true });

watch(houses, (newHouses) => {
    console.log('Houses computed changed:', newHouses);
}, { immediate: true });
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
    z-index: 0;
}

.modal-header {
    background: linear-gradient(135deg, #6200ea 0%, #9c27b0 100%);
    color: white;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 15px rgba(98, 0, 234, 0.2);
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
}

.input-group {
    margin-bottom: 20px;
}

.input-label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
}

.glass-input {
    background-color: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(98, 0, 234, 0.15) !important;
    border-radius: 10px !important;
    transition: all 0.2s ease;
    margin-top: 4px;
}

.glass-input:hover {
    background-color: rgba(255, 255, 255, 0.8) !important;
    box-shadow: 0 4px 10px rgba(98, 0, 234, 0.08);
    border: 1px solid rgba(98, 0, 234, 0.3) !important;
}

.glass-input:focus,
.glass-input.v-input--is-focused {
    background-color: rgba(255, 255, 255, 0.9) !important;
    box-shadow: 0 6px 15px rgba(98, 0, 234, 0.1);
    border: 1px solid rgba(98, 0, 234, 0.5) !important;
}

.date-range-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
}

.color-picker-container {
    display: flex;
    gap: 12px;
    margin-top: 10px;
}

.color-option {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-option:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-option.selected {
    transform: scale(1.1);
    box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
}

.modal-actions {
    padding: 12px 20px 20px;
    position: relative;
    z-index: 1;
}

.cancel-btn {
    border-radius: 10px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    padding: 0 16px;
    height: 40px;
}

.create-btn {
    border-radius: 10px;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    padding: 0 20px;
    height: 40px;
    background: linear-gradient(135deg, #6200ea 0%, #9c27b0 100%) !important;
    box-shadow: 0 4px 15px rgba(98, 0, 234, 0.3) !important;
    transition: all 0.2s ease;
}

.create-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(98, 0, 234, 0.4) !important;
}

/* Make the date picker more modern */
:deep(.v-date-picker-table) {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
}

/* Add these new styles */
:deep(.v-select__content) {
    transition: none !important;
}

:deep(.v-overlay__content) {
    transition: opacity 0.2s ease-in-out !important;
    position: absolute;
}

:deep(.v-select .v-field__input) {
    min-height: 44px;
}

:deep(.v-list) {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-overlay__scrim) {
    opacity: 0 !important;
}

/* Ensure menu appears directly below the input */
:deep(.v-select .v-field) {
    border-radius: 8px;
    transition: all 0.2s ease;
}

:deep(.v-select .v-field.v-field--active) {
    transform: none !important;
}

/* Reset all transitions and transforms */
:deep(.v-overlay--active),
:deep(.v-overlay__content),
:deep(.v-menu),
:deep(.v-field),
:deep(.v-field__field),
:deep(.v-select),
:deep(.v-select__content),
:deep(.select-menu-content) {
    transition: none !important;
}

:deep(.v-overlay__content) {
    border-radius: 8px !important;
    max-width: calc(100vw - 32px) !important;
}

/* Remove problematic position rules */
.house-menu {
    min-width: 250px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

:deep(.house-item) {
    cursor: pointer;
    padding: 8px 16px !important;
    margin: 4px !important;
    border-radius: 6px !important;
    transition: background-color 0.2s ease;
}

:deep(.house-item:hover) {
    background-color: rgba(98, 0, 234, 0.05) !important;
}

:deep(.v-menu__content) {
    z-index: 9999 !important;
    position: fixed !important;
}

:deep(.v-overlay__content) {
    border-radius: 8px !important;
    position: absolute !important;
    max-width: calc(100vw - 32px) !important;
}

.color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

:deep(.v-list-item) {
    margin-bottom: 4px !important;
    border-radius: 8px !important;
}

:deep(.v-list-item:hover) {
    background-color: rgba(98, 0, 234, 0.05) !important;
}

:deep(.v-list-item--active) {
    background-color: rgba(98, 0, 234, 0.1) !important;
}
</style>