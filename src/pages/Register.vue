<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Inscription</h1>
      <form @submit.prevent="register">
        <input v-model="name" type="text" placeholder="Nom" class="input input-bordered w-full mb-4" />
        <input v-model="email" type="email" placeholder="Email" class="input input-bordered w-full mb-4" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="input input-bordered w-full mb-4" />
        <button type="submit" class="btn btn-primary w-full">S'inscrire</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  
  export default {
    setup() {
      const name = ref<string>("");
      const email = ref<string>("");
      const password = ref<string>("");
      const router = useRouter();
      const authStore = useAuthStore();
  
      const register = async () => {
        try {
          await authStore.register({ name: name.value, email: email.value, password: password.value });
          alert("Inscription réussie ! Veuillez vous connecter.");
          router.push({ name: "Login" });
        } catch (error: any) {
          alert(error.message || "Erreur d'inscription.");
        }
      };
  
      return { name, email, password, register };
    },
  };
  </script>
  