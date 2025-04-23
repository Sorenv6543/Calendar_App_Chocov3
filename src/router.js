// src/router.js

import { createRouter, createWebHistory } from "vue-router";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Home from "./components/Home.vue";
import Playground from "./components/Playground.vue";
import Playground2 from "./components/Playground2.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/Register", component: Register },
  { path: "/Home", component: Home },
  { path: "/playground", component: Playground },
  { path: "/playground2", component: Playground2 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
