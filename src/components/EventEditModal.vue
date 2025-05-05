<template>
  <transition name="fade">
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Event</h3>
          <button class="close-button" @click="$emit('close')">
            <span class="close-icon">✕</span>
          </button>
        </div>
        <form @submit.prevent="handleUpdate">
          <div class="form-group">
            <label for="start-date"><i class="icon-field fas fa-clock"></i>Day Start Date:</label>
            <input type="date" id="start-date" v-model="eventData.start" />
          </div>
          <div class="form-group">
            <label for="end-date"><i class="icon-field fas fa-clock"></i>Day End Date:</label>
            <input type="date" id="end-date" v-model="eventData.end" />
          </div>
          <div class="form-group">
            <label for="title"><i class="icon-field fas fa-home"></i>Select House:</label>
            <input type="text" id="title" v-model="eventData.title" />
          </div>
          <div class="form-group">
            <label for="turn"><i class="icon-field fas fa-clock"></i>Add Turn:</label>
            <div class="checkbox-container">
              <input type="checkbox" id="turn" v-model="eventData.turn" />
              <label for="turn" class="checkbox-label"><i class="icon-field fas fa-clock"></i>Enable turn</label>
            </div>
          </div>
          <div class="form-group">
            <label for="notes"><i class="icon-field fas fa-sticky-note"></i>Event Details:</label>
            <textarea id="notes" v-model="eventData.notes" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    isVisible: Boolean,
    eventData: Object
  });

  const emit = defineEmits(['close', 'update']);

  const handleUpdate = () => {
    emit('update', props.eventData);
  };
</script>

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
    z-index: 1000;
  }

  .modal-content {
    background: #f5f9fc;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-weight: bold;
    color: #34495e;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1dde9;
    border-radius: 4px;
    background-color: white;
    transition: border-color 0.2s ease;
  }

  .form-group input:focus {
    outline: none;
    border-color: #66b8ca;
  }

  .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1dde9;
    border-radius: 4px;
    background-color: white;
    transition: border-color 0.2s ease;
    resize: vertical;
  }

  .form-group textarea:focus {
    outline: none;
    border-color: #66b8ca;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #d1dde9;
    background-color: #e6eef5;
    margin: -20px -20px 15px -20px;
    padding: 15px 20px;
  }

  .close-button {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .close-icon {
    color: black;
    font-size: 12px;
    line-height: 1;
    font-weight: bold;
  }

  /* Button styling */
  .modal-actions button {
    background-color: #66b8ca;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .modal-actions button:hover {
    background-color: #5e91c1;
  }

  /* Transition for modal */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  /* Icon styling */
  .icon-field {
    margin-right: 8px;
    color: #5e91c1;
    width: 16px;
    text-align: center;
  }

  /* Checkbox container styling */
  .checkbox-container {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }

  .checkbox-label {
    margin-left: 8px;
    font-weight: normal;
    cursor: pointer;
  }

  input[type="checkbox"] {
    cursor: pointer;
  }
</style>
