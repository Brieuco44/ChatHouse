// assets/js/App.vue
<script>
export default {
  data() {
    return {
      name: '',
      hello: ''
    }
  },
  methods: {

  }
}
</script>

<template>
  <input type="text" v-model="name" class="input">
  <h1 v-show="!!hello">{{ hello }}</h1>
</template>