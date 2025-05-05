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
    redirect: { name: "login" },
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
  // Including the playground routes, we'll make them lazy loaded
  {
    path: "/playground",
    name: "playground",
    component: () => import("./components/Playground.vue"),
  },
  {
    path: "/playground2",
    name: "playground2",
    component: () => import("./components/Playground2.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
