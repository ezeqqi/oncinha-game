<template>
  <v-btn class="mt-2" rounded elevation="10" :to="{name: 'game'}" >
    <v-icon icon="mdi-arrow-left-circle" color="grey-lighten-2" class="mx-auto" />
  </v-btn>
  <div class="d-flex align-items-center full-height px-3">
    <v-row class="justify-center border-sm">
      <v-col v-for="(slot, i) of slots" cols="4" class="slot text-center border-sm pa-0" :key="i">
        <v-select variant="plain" hide-details flat :items="figures" :item-title="getTitle">
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <v-list-item-title class="text-center">
                <v-icon :icon="item.raw.image" :color="item.raw.color"/>
              </v-list-item-title>
              <!-- <v-spacer/> -->
            </v-list-item>
          </template>
          <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" class="bg-grey-darken-3 d">
              <v-list-item-title class="d-none"></v-list-item-title>
              <v-icon :icon="item.raw.image" :color="item.raw.color"/>
            </v-list-item>
          </template>
        </v-select>

        <!-- <div class="" >
          <v-icon
            size="40"
            :icon="slot?.image || 'mdi-minus'"
            :color="slot?.color || 'grey-darken-2'"
            class="mx-auto"
          />
        </div> -->
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const figures = ref([
  {
    name: "Tartaruga",
    prize: 3,
    odds: 32,
    odds2: 48,
    odds3: 40,
    odds_alt: 64,
    image: "mdi-tortoise",
    color: "light-green-lighten-1",
  },
  {
    name: "Garça",
    prize: 5,
    odds: 30,
    odds2: 40,
    odds3: 30,
    odds_alt: 32,
    image: "mdi-bat",
    color: "deep-purple-lighten-3",
  },
  {
    name: "Arara",
    prize: 10,
    odds: 24,
    odds2: 20,
    odds3: 4,
    odds_alt: 16,
    image: "mdi-bird",
    color: "red",
  },
  {
    name: "Mico-leão",
    prize: 25,
    odds: 16,
    odds2: 10,
    odds3: 4,
    odds_alt: 8,
    image: "mdi-weather-sunny",
    color: "amber-lighten-1",
  },
  {
    name: "Peixe",
    prize: 50,
    odds: 12,
    odds2: 6,
    odds3: 4,
    odds_alt: 4,
    image: "mdi-fish",
    color: "cyan-lighten-3",
  },
  {
    name: "Lobo guará",
    prize: 100,
    odds: 8,
    odds2: 2,
    odds3: 5,
    odds_alt: 2,
    image: "mdi-dog-side",
    color: "brown-lighten-1",
  },
  {
    name: "Onça pintada",
    prize: 250,
    odds: 5,
    odds2: 1,
    odds3: 40,
    odds_alt: 1,
    image: "mdi-cat",
    color: "orange-darken-3",
  },
]);
const slots = ref({
  a1: null,
  a2: null,
  a3: null,
  b1: null,
  b2: null,
  b3: null,
  c1: null,
  c2: null,
  c3: null,
});
function getTitle(param) {
  console.log('param >', param)
  return param.name
}

</script>
