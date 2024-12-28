<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold">Bienvenue, {{ authStore.user?.name }}</h1>
      <button @click="logout" class="btn btn-error mt-4">Déconnexion</button>
    </div>
  </template>
  
  <script lang="ts">
  import { useAuthStore } from "@/stores/auth";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      const logout = () => {
        authStore.logout();
        router.push({ name: "Login" });
      };
  
      return { authStore, logout };
    },
  };
  </script>
  