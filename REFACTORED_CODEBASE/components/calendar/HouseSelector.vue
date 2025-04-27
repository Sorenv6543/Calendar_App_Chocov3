<template>
  <div class="input-group">
    <div class="d-flex align-center mb-1">
      <v-icon color="primary" size="20">mdi-home</v-icon>
      <span class="ml-2 input-label">House</span>
    </div>
    <div class="custom-select-container">
      <div
        class="custom-select-header"
        @click.stop="toggleHouseDropdown"
        :class="{ 'disabled': disabled, 'active': !disabled }"
      >
        <div class="selected-house-display">
          <div v-if="selectedHouse" class="d-flex align-center">
            <div
              class="rounded-circle me-2"
              :style="`background-color: ${selectedHouse.color || '#2979ff'}; width: 16px; height: 16px;`"
            ></div>
            <span>{{ selectedHouse.address }}</span>
          </div>
          <span v-else class="placeholder-text">
            {{ disabled ? "No house associated" : "Click to select a house" }}
          </span>
        </div>
        <v-icon v-if="!disabled" color="primary">mdi-chevron-down</v-icon>
      </div>
      <div v-if="showHouseDropdown" class="custom-select-dropdown">
        <div
          v-for="house in uniqueHouses"
          :key="house.houseId"
          class="house-option"
          @click.stop="selectHouse(house)"
        >
          <div class="d-flex align-center">
            <div
              class="rounded-circle me-2"
              :style="`background-color: ${house.color || '#2979ff'}; width: 16px; height: 16px;`"
            ></div>
            <span>{{ house.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface House {
  userId: string
  houseId: string
  address: string
  color: string
  selected?: boolean
  contactnumber?: string
}

const props = defineProps<{
  houses: House[]
  selectedHouse: House | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedHouse', house: House | null): void
}>()

const showHouseDropdown = ref(false)

const uniqueHouses = computed(() => {
  const uniqueMap = new Map<string, House>()
  
  props.houses.forEach((house) => {
    if (house && house.houseId && house.address) {
      if (!uniqueMap.has(house.houseId)) {
        uniqueMap.set(house.houseId, house)
      }
    }
  })

  return Array.from(uniqueMap.values()).sort((a, b) =>
    a.address.localeCompare(b.address)
  )
})

const toggleHouseDropdown = () => {
  if (!props.disabled) {
    showHouseDropdown.value = !showHouseDropdown.value
  }
}

const selectHouse = (house: House) => {
  emit('update:selectedHouse', house)
  showHouseDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.custom-select-container')) {
    showHouseDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-select-header:hover {
  background: rgba(255, 255, 255, 0.08);
}

.custom-select-header.active {
  border-color: var(--v-primary-base);
}

.custom-select-header.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
}

.house-option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.house-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.5);
}

.selected-house-display {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 