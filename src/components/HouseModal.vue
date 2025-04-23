<!--Script---------->

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeModal"]);

const userStore = useUserStore();

const formData = ref({
  address: "",
  contactnumber: "",
  color: "#66b8ca", // Default color
});

const isSubmitting = ref(false);
const errorMessage = ref("");

const createHouse = async () => {
  if (!formData.value.address) {
    errorMessage.value = "Address is required.";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await userStore.createHouse(formData.value);
    close();
  } catch (error) {
    errorMessage.value = "Failed to add house. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  emit("closeModal");
  formData.value = { address: "", contactnumber: "" };
  errorMessage.value = "";
};
</script>

<!--Template----------->

<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <h4>Add New House</h4>
      <form @submit.prevent="createHouse">
        <label>
          Address:
          <input type="text" v-model.trim="formData.address" required />
        </label>
        <label>
          Contact Number:
          <input type="tel" v-model.trim="formData.contactnumber" />
        </label>
        <label>
          House Color:
          <input type="color" v-model.trim="formData.color" />
        </label>
        <div class="modal-actions">
          <button type="button" @click="close">Cancel</button>
          <button type="submit" :disabled="isSubmitting">Create</button>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensure it appears above the calendar */
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1010; /* Layer above the overlay */
}
</style>
