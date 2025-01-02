<template>
  <div id="app" class="d-flex flex-column h-screen">
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <router-link to="/">
          <font-awesome-icon icon="fa-solid fa-people-roof" size="2xl" />
        </router-link>
      </div>
      <div class="navbar-end">
        <button type="button" v-if="isLogin()"  class="btn btn-link btn-ghost" @click="logout">
          <font-awesome-icon icon="fa-solid fa-power-off" class="text-error" />
        </button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "App",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const isLogin = authStore.isLogin;

    const logout = async () => {
      await authStore.logout();
      router.push({ name: "Login" });
    };

    return { logout, isLogin };
  },
});
</script>
