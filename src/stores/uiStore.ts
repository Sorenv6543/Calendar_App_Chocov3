import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    // Modal visibility states
    showHouseModal: false,
    showEventModal: false,
    
    // Calendar view state
    calendarView: "month", // 'month', 'week', 'day'
    
    // Event modal state
    eventModalData: {
      event: null as any | null,
      startDate: "",
      endDate: "",
    },
    
    // Layout states
    isMobileView: window.innerWidth <= 768,
    showSidebar: false,
    sidebarPersistent: true,
  }),
  
  actions: {
    // Modal control
    openHouseModal() {
      this.showHouseModal = true;
    },
    
    closeHouseModal() {
      this.showHouseModal = false;
    },
    
    openEventModal(data?: { event?: any, startDate?: string, endDate?: string }) {
      if (data) {
        this.eventModalData.event = data.event || null;
        this.eventModalData.startDate = data.startDate || "";
        this.eventModalData.endDate = data.endDate || "";
      }
      this.showEventModal = true;
    },
    
    closeEventModal() {
      this.showEventModal = false;
      // Reset modal data when closing
      this.eventModalData = {
        event: null,
        startDate: "",
        endDate: "",
      };
    },
    
    // Calendar view control
    setCalendarView(view: string) {
      this.calendarView = view;
    },
    
    // Sidebar control
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    
    toggleSidebarPersistent() {
      this.sidebarPersistent = !this.sidebarPersistent;
    },
    
    // Responsive layout
    updateViewportSize() {
      this.isMobileView = window.innerWidth <= 768;
    }
  }
}); 