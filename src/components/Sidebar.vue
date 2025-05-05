<script setup lang="ts">
import { ref } from 'vue';

defineProps({
    persistent: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['toggle-persistent', 'add-house', 'create-event']);

function togglePersistent() {
    emit('toggle-persistent');
}

function addHouse() {
    emit('add-house');
}

function createEvent() {
    emit('create-event');
}
</script>

<template>
    <aside class="sidebar" :class="{ 'persistent': persistent }">
        <div class="sidebar-header">
            <h2>Menu</h2>
            <button @click="togglePersistent" class="pin-button">
                {{ persistent ? 'Unpin' : 'Pin' }}
            </button>
        </div>

        <div class="sidebar-content">
            <button @click="addHouse" class="sidebar-btn">Add House</button>
            <button @click="createEvent" class="sidebar-btn">Create Event</button>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    background-color: #f4f6f8;
    width: 250px;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    padding: 1rem;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-btn {
    background-color: #4169e2;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.sidebar-btn:hover {
    background-color: #3a5ecc;
}

.pin-button {
    background-color: transparent;
    border: 1px solid #4169e2;
    color: #4169e2;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
}

.pin-button:hover {
    background-color: rgba(65, 105, 226, 0.1);
}
</style>