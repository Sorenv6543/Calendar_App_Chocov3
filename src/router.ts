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
    path: "/login",
    name: "login-direct",
    component: () => import("./components/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./components/Register.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("./components/Home.vue"),
  },
  {
    path: "/userprofile",
    name: "userprofile",
    component: () => import("./components/Userprofile.vue"),
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
