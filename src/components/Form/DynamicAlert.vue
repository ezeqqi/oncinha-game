<template>
  <v-slide-y-transition>
    <div v-show="warning.modal">
      <v-alert
        v-model="warning.modal"
        class="mb-2"
        :type="warning.type"
        closable
      >
        <div v-for="(messages, field) of warning.text" :key="i">
          <p class="text-h6">
            {{ `${$t(`cruds.${cruds}.fields.${field}`)}` }}
          </p>
          <p v-for="(msg, i) of messages" :key="i">
            {{ `- ${msg}` }}
          </p>
          <br>
        </div>
      </v-alert>
    </div>
  </v-slide-y-transition>

</template>
<script setup>
import { watch, computed } from 'vue';
const props = defineProps(['alert', 'cruds'])
const warning = computed(() => props.alert)
const emits = defineEmits(['update:alert'])
watch(
  warning,
  (newVal) => {
    emits('update:alert', newVal)
  },
  {
    immediate: true,
  }
)
</script>
