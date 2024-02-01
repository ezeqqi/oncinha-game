<template>
  <v-btn class="mt-2" rounded elevation="10" :to="{name: 'game'}" >
    <v-icon icon="mdi-arrow-left-circle" color="grey-lighten-2" class="mx-auto" />
  </v-btn>
  <!-- <p class="text-center text-h6">History</p> -->
  <div class="d-flex align-items-center full-height">
    <v-col cols="12">
      <v-list class="py-0" lines="two">
        <template
          v-for="game of stories"
          :key="game.id"
        >
          <v-list-item>
            <template v-slot:prepend="{prepend}">
              <v-icon :icon="getIcon(game)" :color="winners(game) ? 'green' : 'red'"></v-icon>
            </template>
            <template v-slot:subtitle="{subtitle}">
              <div class="text-body-">
                {{ game.date }}
              </div>

            </template>
            <template v-slot:title="{titl}">
              <div :class="winners(game) ? 'text-body-1' : 'text-body-2'" style="font-weight: 500;">
                {{ pointsToMoney(game.balance) }}
              </div>
            </template>
            <template v-slot:append="{appen}" >
              <div>
                <div class="text-caption text-red-lighten-2" style="font-size: small;">
                  - {{ pointsToMoney(game.bet) }}
                </div>
                <div class="text-caption text-green-lighten-2" style="font-size: small;">
                  + {{ pointsToMoney(game.prize) }}
                </div>
              </div>
            </template>
            <template v-slot:default="{defaul}">
              <div class="text-body-1">
              </div>
            </template>
          </v-list-item>
          <v-divider />
        </template>
        <v-list-item>
          <template v-slot:prepend="{prepend}">
            <v-icon icon="mdi-information"></v-icon>
          </template>
          <template v-slot:subtitle="{subtitle}">
            Data
          </template>
          <template v-slot:title="{titl}">
            Saldo ( A - P)
          </template>
          <template v-slot:append="{appen}" >
            <div>
              <div class="text-caption text-red-lighten-2" style="font-size: small;">
                - Aposta
              </div>
              <div class="text-caption text-green-lighten-2" style="font-size: small;">
                + Prêmio
              </div>
            </div>
          </template>
          <template v-slot:default="{defaul}">
            <div class="text-body-1">
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-col>

  </div>
</template>
<script setup>
import { ref } from 'vue';

const stories = ref(loadHistory())

function loadHistory() {
  //TODO: implementar um input de name antes de salvar
  const games = localStorage.getItem(`game-history`)
  return JSON.parse(games)
}
//
// const history = {
//     id,
//     pocketBefore,
//     bet,
//     slotsResult,
//     winners,
//     prize,
//     balance,
//     date,
//   };
function winners(val) {
  return val.winners.length
}

function getIcon(val) {
  const wins = winners(val)
  switch(wins){
    case 1:
      return 'mdi-cash';
    case 2:
    case 3:
    case 4:
    case 5:
      return 'mdi-cash-multiple'
    default:
       return 'mdi-minus'
  }
}
function pointsToMoney(val) { //TODO: composable dessas functions
  const price = val / 100;
  return price.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}
function moneyToPoints(val) {
  const numericValue = parseFloat(val.replace(/[^\d.,]/g, "").replace(",", "."));
  const points = numericValue * 100;
  return Math.round(points);
}
//TODO:
// function finalCount() {
//   const finalItem = {

//   }
//   for(const [key, val] of Object.entries(stories.value)) {
//     finalItem[]
//   }
// }
</script>
