import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore(
  'notification',
  () => {
    const state = ref(initialState())
    function initialState() {
      return {
        modal: false,
        text: '',
        type: '',
        color: '',
      }
    }
    function resetState() {
      state.value = initialState()
    }
    function setNotification(data) {
      Object.assign(state.value, data)
    }
    return {
      state,
      initialState,
      resetState,
      setNotification,
    }
  },
  {
    persist: true,
  }
)
