<!--Script---------->

<script setup>
import { ref } from "vue";
import HouseModal from "./HouseModal.vue";

const showModal = ref(false);
</script>

<!--Template----------->

<template>
  <div>
    <button @click="showModal = true">Add House</button>
    <HouseModal v-if="showModal" 
      :is-visible="showModal" 
      @closeModal="showModal = false"
    />
  </div>
</template>

<!--Style----------->
<style scoped>
button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #36b5f4;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #41a8e4;
}
</style>
