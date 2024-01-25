<template>
  <v-app theme="dark">
    <default-view :full="isFullHeight"/>
  </v-app>
</template>

<script setup>
import DefaultView from './View.vue'
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
const route = useRoute()

const isFullHeight = ref(false)
watch(
  route,
  () => {
    if(route.meta.isFull != undefined) {
      isFullHeight.value = route.meta.isFull
      return
    }
  },
  {
    immediate: true
  }
)
</script>
