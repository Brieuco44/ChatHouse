<template>
  <div id="app" class="d-flex flex-column h-screen">
    <nav class="navbar px-5">
      <router-link  to="/">
        <font-awesome-icon icon="fa-solid fa-people-roof" size="2xl" />
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: "App",
};
</script>

<style>

</style>

