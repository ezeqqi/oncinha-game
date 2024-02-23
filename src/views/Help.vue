<template>
  <v-row>
    <!-- <v-col cols="auto">
      <v-btn size="sm" rounded elevation="10" :to="{name: 'game'}" >
        <v-icon icon="mdi-arrow-left-circle" color="grey-lighten-2" class="mx-auto" />
      </v-btn>
    </v-col> -->
    <v-col class="px-0 clickable" @click="toGame">
      <p class="my-4 text-h4 text-center text-no-wrap">
        Jogo da Oncinha 
        <v-icon icon="mdi-cat" color="orange-darken-3" />
        <!-- &#x1F405 -->
      </p>
    </v-col>
  </v-row>
  <ul>
    <li class="text-body-2 text-justify my-2" v-for="(text, i) of info" :key="i">
      {{ text }}
    </li>
  </ul>
  <div class="text-center">
    <v-btn size="80" rounded elevation="10" :to="{name: 'game'}" >
      <v-icon size="40" icon="mdi-play" color="grey-lighten-2" class="mx-auto" />
    </v-btn>
  </div>
  <p class="text-h6 text-center my-4"> Multiplicadores de prêmio</p>
  <v-row>
    <v-col class="p-0" cols="4" v-for="(fig, i) of figures" :class="fig.clas" :key="i">
      <v-icon :icon="fig.image" :color="fig.color" size="25"/> {{ fig.prize }}
    </v-col>
  </v-row>
  <div class="text-body-2 px-0 my-4">
    <b>Oncinha </b> é a figura WILD ou seja ela vale para qualquer combinação.
  </div>
  <div style="font-size: 10px;">
    Porém o prêmio máximo da oncinha só é valido se todas figuras da linha forem oncinha.
  </div>
  
  <!-- <div class="my-4 p-" v-for="(rule, ind) of rules" :key="ind">
    <p class="text-h6 mb-2"> {{ rule.title }}</p>
    <ul class="text-body1">
      <li v-for="(dot, i) of rule.dots" :key="i">
        {{ dot }}
      </li>
    </ul>
  </div> -->
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter()
const rules = ref([
  {
    title: "Bem vindo ao Jogo da Oncinha!",
    dots: [
      "O objetivo do jogo é conseguir combinações vencedoras nas linhas de aposta.",
      "As 5 linhas de aposta do jogo são as 3 linhas horizontais e as duas diagonais",
      "Cada rodada apresenta 7 figuras representando animais da fauna brasileira que podem formar combinações vencedoras.",
      "As combinações vencedoras são determinadas pelas figuras que aparecem em cada linha de aposta.",
    ]
  },
  {
    title: "Apostas e Premiações:",
    dots: [
      "Antes de girar os slots, você pode escolher o valor da sua aposta atual.",
      "Quanto maior a sua aposta, maiores serão suas possíveis premiações em caso de vitória.",
      "As apostas são multiplicadas com base nas linhas de aposta vencedoras.",
      "Cada linha de aposta vencedora contribui para o total da premiação.",
    ]
  },
  {
    title: "Funcionamento das Premiações:",
    dots: [
      "As premiações são calculadas com base no valor da sua aposta atual.",
      "As combinações vencedoras em cada linha de aposta são multiplicadas pelo valor da aposta.",
      "O total das premiações é acumulado ao longo do jogo e pode ser visto na seção de Prêmios.",
    ]
  },
  { 
    title: "Saldo e Adição de Fundos:",
    dots: [
      "Seu saldo atual é exibido na seção de Carteira.",
      "Se precisar adicionar mais fundos, clique no ícone de porquinho e escolha a opção 'Add funds'.",
      "Você pode adicionar fundos conforme necessário para continuar jogando e aumentar suas chances de ganhar.",
    ]
  },
])
const info =  [
  "Junte combinações vencedoras nas 5 linhas de aposta para ganhar grandes prêmios com as figuras da fauna brasileira.",
  "Aumente suas apostas para multiplicar suas recompensas e acumule prêmios ao longo do jogo.",
  "Mantenha seu saldo na mira e adicione fundos quando necessário para manter a diversão e aumentar suas chances de ganhar.",
]
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
    clas: 'text-start pl-2'
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
    clas: 'text-center'
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
    clas: 'text-end pr-2'
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
    clas: 'text-start pl-2'
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
    clas: 'text-center'
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
    clas: 'text-end pr-2'
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
    clas: 'text-start pl-2'
  },
]);

function getTitle(param) {
  console.log('param >', param)
  return param.name
}
function pointsToMoney(val) {
  const price = val / 100;
  return price.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}
function toGame() {
  router.push({name: 'game'})
}
</script>
