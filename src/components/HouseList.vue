<template>
  <v-card elevation="2" class="house-list-card">
    <v-card-title class="text-h5 font-weight-medium">
      Your Houses
    </v-card-title>
    
    <v-list v-if="userStore.userData && userStore.userData.houses">
      <v-list-item
        v-for="house in userStore.userData.houses"
        :key="house.houseId"
        class="my-1"
      >
        <template v-slot:prepend>
          <v-avatar size="36" :color="house.color || '#66b8ca'"></v-avatar>
        </template>
        
        <v-list-item-title>{{ house.address }}</v-list-item-title>
        <v-list-item-subtitle>{{ house.contactnumber }}</v-list-item-subtitle>
        
        <template v-slot:append>
          <v-btn
            icon="mdi-delete"
            density="compact"
            color="error"
            variant="text"
            @click.stop="confirmDelete(house)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
    
    <v-card-text v-else class="text-center py-4">
      <v-icon icon="mdi-home-outline" size="large" color="grey" class="mb-2"></v-icon>
      <div>No houses added yet.</div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showAddHouseModal" max-width="450px">
    <v-card>
      <v-card-title class="text-h6">Add New House</v-card-title>
      <v-card-text>
        <!-- Add your form for adding a house here -->
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="showAddHouseModal = false">Cancel</v-btn>
        <v-btn color="primary" @click="addHouse">Add House</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-btn
    icon="mdi-plus"
    color="primary"
    class="add-house-btn"
    @click="showAddHouseModal = true"
  ></v-btn>
</template>



<script setup>
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const confirmDelete = (house) => {
  if (confirm(`Are you sure you want to delete ${house.address}?`)) {
    userStore.deleteHouse(house); // Make sure deleteHouse is correctly implemented in userStore
  }
};
</script>

<!--Style----------->
<style scoped>
.house-list ul {
  list-style-type: disc;

  padding: 0;
}
.house-list li {
  padding: 7px;
  cursor: pointer;
  /* border: 1px solid #7e3939; */
  margin-bottom: 5px;
font-size: small;
font-weight: 600;
}
.house-list li.active {
  background-color: #d8ebf5;
  color: rgb(100, 29, 29);
}
.delete-button {
  margin-left: 10px;
  color: #ff6b6b;
  cursor: pointer;
}
.delete-button:hover {
  color: #ff3333;
}

.color-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}
</style>
