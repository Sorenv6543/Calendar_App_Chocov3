<!--Script---------->

<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import Sidebar from './Sidebar.vue';
import FullCalendar from './FullCalendar.vue';

const router = useRouter();
const userStore = useUserStore();
const showSidebar = ref(false);
const isMobileView = ref(window.innerWidth <= 768);










const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Handle window resize to detect mobile view
const handleResize = () => {
  isMobileView.value = window.innerWidth <= 768;
};

onMounted(() => {
  userStore.initAuthListener();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<!--Template----------->

<template>
  <div v-if="userStore.userData" class="app-background">
    <div class="home-container">
      <Sidebar :class="{ 'show': showSidebar, 'mobile-view': isMobileView }" />

      <div class="main-content" :class="{ 'sidebar-visible': showSidebar }">
        <FullCalendar :user-id="userStore.userData.id" />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="loader"></div>
  </div>
</template>

<!--Style----------->
<style scoped>
.app-background {
  background-color: #e0e0e4;
  /* Even darker background */
  min-height: 100vh;
  width: 100%;
}

.home-container {
  display: flex;
  height: 100vh;
  width: 100%;
  position: relative;

  /* Lower content by 15px */
  background-color: #b7bfd5;
}

.main-content {
  flex: 1;
  position: relative;

  transform: translateX(0);
  transition: transform 0.3s ease;
  will-change: transform;
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 40px;
  background: linear-gradient(135deg, rgba(65, 105, 226, 0.75) 0%, rgba(102, 187, 106, 0.75) 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  position: absolute;
  top: 200px;
  left: 15px;
  z-index: 100;
  transition: all 0.3s ease;
  will-change: transform, left;
  animation: togglePulse 2s infinite;
  clip-path: polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%, 15% 50%);
  backdrop-filter: blur(4px);
}

@keyframes togglePulse {
  0% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 0 rgba(65, 105, 226, 0.5);
    background-position: 0% 50%;
  }

  50% {
    transform: scale(1.05) rotate(0deg);
    box-shadow: 0 0 0 10px rgba(65, 105, 226, 0);
    background-position: 100% 50%;
  }

  100% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 0 rgba(65, 105, 226, 0);
    background-position: 0% 50%;
  }
}

.sidebar-toggle.moved {
  left: 30px;
  top: 170px;
  background: linear-gradient(135deg, rgba(102, 187, 106, 0.75) 0%, rgba(65, 105, 226, 0.75) 100%);
  transform: rotate(180deg);
  animation: movedTogglePulse 2s infinite;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  background-size: 200% 200%;
}

@keyframes movedTogglePulse {
  0% {
    background-position: 0% 50%;
    box-shadow: 0 0 10px rgba(244, 197, 48, 0.3);
  }

  50% {
    background-position: 100% 50%;
    box-shadow: 0 0 15px rgba(244, 197, 48, 0.5);
  }

  100% {
    background-position: 0% 50%;
    box-shadow: 0 0 10px rgba(244, 197, 48, 0.3);
  }
}

.toggle-icon {
  color: white;
  stroke: white;
  stroke-width: 3;
  transition: transform 0.3s ease;
  width: 24px;
  height: 24px;
  position: relative;
  left: -2px;
}

.sidebar-toggle:hover .toggle-icon {
  transform: scale(1.2);
}

/* When sidebar is visible, transform main content instead of using margin */
.main-content.sidebar-visible {
  transform: translateX(310px);
}

.calendar-wrapper {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

#logout {
  height: 30px;
}

/* Sidebar is hidden by default on all screen sizes */
.sidebar-hidden {
  position: fixed;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 20;
  height: 100vh;
  will-change: transform;
}

/* Sidebar becomes visible when .show class is applied */
.sidebar-hidden.show {
  transform: translateX(0);
}

/* Ensure consistent behavior at all screen sizes */
@media (max-width: 768px) {
  .home-container {
    padding-left: 0;
  }

  /* Make sidebar cover whole screen in mobile */
  .main-content.sidebar-visible {
    transform: translateX(0);
    opacity: 0.3;
    pointer-events: none;
  }

  /* Mobile toggle styling */
  .sidebar-toggle {
    width: 60px;
    height: 44px;
    left: 20px;
    top: 120px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    animation: togglePulseMobile 2s infinite;
    background-size: 200% 200%;
    background: linear-gradient(135deg, rgba(65, 105, 226, 0.75) 0%, rgba(102, 187, 106, 0.75) 100%);
  }

  @keyframes togglePulseMobile {
    0% {
      transform: scale(1) rotate(0deg);
      box-shadow: 0 0 0 0 rgba(65, 105, 226, 0.5);
      background-position: 0% 50%;
    }

    50% {
      transform: scale(1.1) rotate(0deg);
      box-shadow: 0 0 0 15px rgba(65, 105, 226, 0);
      background-position: 100% 50%;
    }

    100% {
      transform: scale(1) rotate(0deg);
      box-shadow: 0 0 0 0 rgba(65, 105, 226, 0);
      background-position: 0% 50%;
    }
  }

  /* Move toggle button when sidebar is visible on mobile */
  .sidebar-toggle.moved {
    left: 20px;
    top: 120px;
    background: linear-gradient(135deg, rgba(102, 187, 106, 0.75) 0%, rgba(65, 105, 226, 0.75) 100%);
    clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
    background-size: 200% 200%;
  }
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #36b5f4;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
