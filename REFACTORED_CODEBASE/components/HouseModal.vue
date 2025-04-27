<!--Script---------->

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import type { House, HouseModalProps, HouseModalEmits } from "@/types/house";

// Props and Emits
const props = defineProps<HouseModalProps>();
const emit = defineEmits<HouseModalEmits>();

const userStore = useUserStore();
const houseName = ref<string>("");
const houseAddress = ref<string>("");
const isSubmitting = ref<boolean>(false);
const errorMessage = ref<string>("");

// Watch for modelValue changes to reset form
watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        resetForm();
    }
});

const resetForm = (): void => {
    houseName.value = "";
    houseAddress.value = "";
    errorMessage.value = "";
};

const validateForm = (): boolean => {
    if (!houseName.value.trim()) {
        errorMessage.value = "House name is required";
        return false;
    }
    if (!houseAddress.value.trim()) {
        errorMessage.value = "House address is required";
        return false;
    }
    return true;
};

const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    isSubmitting.value = true;
    errorMessage.value = "";

    try {
        const newHouse: Omit<House, 'id' | 'createdAt' | 'updatedAt'> = {
            name: houseName.value.trim(),
            address: houseAddress.value.trim(),
            userId: userStore.userData?.id || ""
        };

        await userStore.createHouse(newHouse);
        emit('update:modelValue', false);
        resetForm();
    } catch (error) {
        console.error("Error creating house:", error);
        errorMessage.value = "Failed to create house. Please try again.";
    } finally {
        isSubmitting.value = false;
    }
};

const handleClose = (): void => {
    emit('close');
    resetForm();
};
</script>

<!--Template----------->

<template>
    <div v-if="modelValue" class="modal-overlay" @click="handleClose">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Add New House</h2>
                <button class="close-button" @click="handleClose">&times;</button>
            </div>

            <form @submit.prevent="handleSubmit" class="modal-form">
                <div class="form-group">
                    <label for="houseName">House Name</label>
                    <input id="houseName" v-model="houseName" type="text" placeholder="Enter house name"
                        :disabled="isSubmitting" />
                </div>

                <div class="form-group">
                    <label for="houseAddress">Address</label>
                    <input id="houseAddress" v-model="houseAddress" type="text" placeholder="Enter house address"
                        :disabled="isSubmitting" />
                </div>

                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>

                <div class="modal-footer">
                    <button type="button" class="cancel-button" @click="handleClose" :disabled="isSubmitting">
                        Cancel
                    </button>
                    <button type="submit" class="submit-button" :disabled="isSubmitting">
                        {{ isSubmitting ? "Creating..." : "Create House" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<!--Style----------->
<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    color: #333;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-weight: 500;
    color: #444;
}

.form-group input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-group input:focus {
    outline: none;
    border-color: #36b5f4;
}

.error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.cancel-button,
.submit-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    color: #666;
}

.cancel-button:hover {
    background-color: #e5e5e5;
}

.submit-button {
    background-color: #36b5f4;
    border: none;
    color: white;
}

.submit-button:hover {
    background-color: #2a9cd8;
}

.submit-button:disabled {
    background-color: #a0d4f0;
    cursor: not-allowed;
}
</style>