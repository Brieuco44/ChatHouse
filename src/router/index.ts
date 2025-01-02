import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/Register.vue"),
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/pages/Dashboard.vue"),
    // meta: { requiresAuth: true },
  },
  {
    path: "/chat/:id",
    name: "Chat",
    component: () => import("@/pages/Chat.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: "Login" });
  } else {
    if (!authStore.contact && authStore.token) {
      await authStore.fetchContact();
    }
    next();
  }
});

export default router;
