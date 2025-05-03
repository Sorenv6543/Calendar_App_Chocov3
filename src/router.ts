// src/router.ts

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Use lazy loading for components to improve performance
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "login",
    component: () => import("./components/Login.vue"),
  },

  {
    path: "/home",
    name: "home",
    component: () => import("./components/Home.vue"),
  },

  {
    path: "/userprofile",
    name: "userprofile",
    component: () => import("./pages/Userprofile.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
