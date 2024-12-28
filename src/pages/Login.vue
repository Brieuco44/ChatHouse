<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Connexion</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" class="input input-bordered w-full mb-4" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="input input-bordered w-full mb-4" />
        <button type="submit" class="btn btn-primary w-full">Se connecter</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  
  export default {
    setup() {
      const email = ref<string>("");
      const password = ref<string>("");
      const router = useRouter();
      const authStore = useAuthStore();
  
      const login = async () => {
        try {
          await authStore.login({ email: email.value, password: password.value });
          router.push({ name: "Dashboard" });
        } catch (error: any) {
          alert(error.message || "Erreur de connexion.");
        }
      };
  
      return { email, password, login };
    },
  };
  </script>
  