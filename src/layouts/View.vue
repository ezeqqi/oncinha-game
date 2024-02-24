<template>
  <v-app theme="dark">
    <v-main class="bg-grey-darken">
      <v-snackbar
        variant="flat"
        v-model="notification.modal"
        :timeout="5000"
        :color="notification.color"
      >
        <div class="text-subtitle-1">
          <v-icon :icon="notification.icon" color="white" class="mr-2" />
          {{ notification.text }}
        </div>
      </v-snackbar>
      <v-row class="justify-center ma-0">
        <v-col cols="9" class="max-">
          <router-view />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification.js'
const notificationStore = useNotificationStore()
const storeNotification = computed(() => notificationStore.state)
const notification = ref({
  modal: false,
  text: '',
  icon: '',
  color: '',
})
watch(
  storeNotification,
  () => {
    if(!!storeNotification.value.text) {
      notification.value = storeNotification.value
    }
  },
  {
    immediate: true
  }
)
</script>
