<template>
  <v-row class="justify-center ">
    <v-col cols="3" class="max-4 ">
      <div class="d-flex flex-column align-content-center text-center">
        <p class="text-h2">{{ RNG }}</p>
        <v-icon size="80" :icon="oneCell?.image || 'mdi-none'" color="yellow" class="mx-auto"/>
        <p class="text-subtitle-1">{{ oneCell?.name }}</p>
      </div>
    </v-col>
  </v-row>
  <v-row class="justify-center">
    <v-col cols="auto" class="max-4">
      <v-btn size="300" rounded elevation="10" @click.stop="roll">
        <v-icon icon="mdi-cat" size="150" color="white" />
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useNotificationStore } from "@/stores/notification";
const notificationStore = useNotificationStore()
const RNG = ref(0)
const oneCell = ref(null)
// const cells = ref([

// ])
const figures = [
  {
    name: 'Tartaruga',
    prize: 3,
    odds: 48,
    odds_alt: 64,
    image: 'mdi-tortoise'
  },
  {
    name: 'Garça',
    prize: 5,
    odds: 40,
    odds_alt: 32,
    image: 'mdi-bat'
  },
  {
    name: 'Arara',
    prize: 10,
    odds: 20,
    odds_alt: 16,
    image: 'mdi-bird'
  },
  {
    name: 'Mico-leão',
    prize: 25,
    odds: 10,
    odds_alt: 8,
    image: 'mdi-weather-sunny'
  },
  {
    name: 'Peixe',
    prize: 50,
    odds: 6,
    odds_alt: 4,
    image: 'mdi-fish'
  },
  {
    name: 'Lobo guará',
    prize: 100,
    odds: 2,
    odds_alt: 2,
    image: 'mdi-dog-side'
  },
  {
    name: 'Onça pintada',
    prize: 250,
    odds: 1,
    odds_alt: 1,
    image: 'mdi-cat'
  },
]


const cells_per_column = 128
const chances_test = [
  64,
  32,
  16,
  8,
  4,
  2,
  1,
]

const chances_two = [
  48,
  40,
  20,
  10,
  6,
  2,
  1,
]

function roll() {
  const random = Math.floor(Math.random() * 128);
  RNG.value = random
  oneCell.value = mappCellFigure(random)
}
function mappCellFigure(num) {
  let accumulator = 0
  for(let i = 0; i < figures.length; i++) {
    let figure = figures[i]
    accumulator += figure.odds
    if(num <= accumulator) {
      return figure
    }
  }
}
</script>
