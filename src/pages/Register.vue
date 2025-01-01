<template>
  <div class="container mx-auto my-auto p-5">
    <div class="mx-auto w-96">
      <h1 class="text-2xl font-bold mb-4">Inscription</h1>
      <form @submit.prevent="register">
        <input v-model="name" type="text" placeholder="Nom" class="input input-bordered w-full mb-4" />
        <input v-model="email" type="email" placeholder="Email" class="input input-bordered w-full mb-4" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="input input-bordered w-full mb-4" />
        <input v-model="telephone" type="tel" name="telephone" id="telephone" class="input input-bordered w-full mb-4" />
        <input v-model="birthdate" type="date" name="dateNaiss" id="password" class="input input-bordered w-full mb-4" />
        <p class="text-sm mb-4">
          Déjà un compte ? <router-link to="/login" class="text-blue-500">Connectez-vous</router-link>
        </p>
        <button type="submit" class="btn btn-primary w-full">S'inscrire</button>
      </form>
    </div>
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
    const telephone = ref<string>("");
    const birthdate = ref<string>("");
    const router = useRouter();
    const authStore = useAuthStore();

    const register = async () => {
      try {
        await authStore.register({ fullname: name.value, email: email.value, password: password.value, telephone: telephone.value, birthdate: birthdate.value });
        alert("Inscription réussie ! Veuillez vous connecter.");
        router.push({ name: "Login" });
      } catch (error: any) {
        alert(error.message || "Erreur d'inscription.");
      }
    };

    return { name, email, password, telephone, birthdate, register };
  },
};
</script>