<template>
  <v-main class="bg-grey-darken">
    <v-container :class="{'full-height': full }">
      <v-row justify="center">
        <v-col cols="12">
          <v-snackbar
            variant="flat"
            v-model="notification.modal"
            :timeout="5000"
            :color="notification.color"
          >
            <div class="text-subtitle-1">
              <v-icon :icon="notification.type" color="white" />
              {{ notification.text }}
            </div>
          </v-snackbar>
          <router-view />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification.js'
defineProps(['full'])
const notificationStore = useNotificationStore()
const storeNotification = computed(() => notificationStore.state)
const notification = ref({
  modal: false,
  text: '',
  type: '',
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
