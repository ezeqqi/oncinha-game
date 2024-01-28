<template>
  <v-container class="d-none">
    <v-row class="justify-center d-h">
      <v-col cols="3" class="max-4 ">
        <div class="d-flex flex-column align-content-center text-center">
          <p class="text-h5">{{ RNG }}</p>
          <v-icon size="40" :icon="oneCell?.image || 'mdi-minus'" :color="oneCell?.color || 'grey-darken-2'" class="mx-auto"/>
          <p class="text-subtitle-1">{{ oneCell?.name }}</p>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="auto" class="max-4">
        <v-btn size="120" rounded elevation="10" @click.stop="spin">
          Spin
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-row class="justify-center">
    <v-col cols="9">
      <v-row class="justify-center border-sm">
        <v-col v-for="(slot, i) of slots" cols="4" class="text-center border-sm" :key="i">
          <v-icon size="40" :icon="slot?.image || 'mdi-minus'" :color="slot?.color || 'grey-darken-2'" class="mx-auto"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row class="justify-center mt-8">
    <v-col cols="9">
      <v-row class="border-sm">
        <v-col cols="4" class="text-center border-sm">
          {{ pocket }}
        </v-col>     
        <v-col cols="4" class="text-center border-sm">

          {{ currentBet }}
        </v-col>     
        <v-col cols="4" class="text-center border-sm">
          {{ historyBalance }}
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row class="justify-center">
    <v-col cols="auto" class="max-4">
      <v-btn size="100" rounded elevation="10" @click.stop="roll">
        <v-icon size="50" icon="mdi-motion" color="grey-lighten-2" class="mx-auto"/>
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
const figures = ref([
  {
    name: 'Tartaruga',
    prize: 3,
    odds: 48,
    odds_alt: 64,
    image: 'mdi-tortoise',
    color: 'light-green-lighten-1',
  },
  {
    name: 'Garça',
    prize: 5,
    odds: 40,
    odds_alt: 32,
    image: 'mdi-bat',
    color: 'deep-purple-lighten-3',
  },
  {
    name: 'Arara',
    prize: 10,
    odds: 20,
    odds_alt: 16,
    image: 'mdi-bird',
    color: 'red',
  },
  {
    name: 'Mico-leão',
    prize: 25,
    odds: 10,
    odds_alt: 8,
    image: 'mdi-weather-sunny',
    color: 'amber-lighten-1',
  },
  {
    name: 'Peixe',
    prize: 50,
    odds: 6,
    odds_alt: 4,
    image: 'mdi-fish',
    color: 'cyan-lighten-3',
  },
  {
    name: 'Lobo guará',
    prize: 100,
    odds: 2,
    odds_alt: 2,
    image: 'mdi-dog-side',
    color: 'brown-lighten-1',
  },
  {
    name: 'Onça pintada',
    prize: 250,
    odds: 1,
    odds_alt: 1,
    image: 'mdi-cat',
    color: 'orange-darken-3',
  },
])
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
})

//      # SLOTS
//
//      1     2     3
//
// A    A1    A2    A3
//
// B    B1    B2    B3
//
// C    C1    C2    C3

const chances_test = [
  64,
  32,
  16,
  8,
  4,
  2,
  1,
]
// RNG  <= 64

const chances_two = [
  48,
  40,
  20,
  10,
  6,
  2,
  1,
]



// ROLL  <=  48    <=  88    <=  108   <=  118   <=  124   <=  126   ==  127
//           tar       grç       ara       mic       pxe       lob       ONÇA
function spin() {
  const random = Math.floor(Math.random() * 128);
  // const random = 127
  RNG.value = random
  oneCell.value = mappCellFigure(random)
  return mappCellFigure(random)
}

function mappCellFigure(num) {
  let accumulator = 0
  for(let i = 0; i < figures.value.length; i++) {
    let figure = figures.value[i]
    accumulator += figure.odds
    if(num <= accumulator) {
      return figure
    }
  }
}
function spinAll() {
  for(const cell in slots.value) {
    slots.value[cell] = spin()
  }
}
function saveHistory() {
  const register = {
    slots: slots.value,
    date: new Date()
  }
}
const bettingTokens = [40, 200, 1000, 5000]
const initialPocket = 5000  
// essa bet é uma soma do minimo de aposta por linha de aposta: 5 * 
const lineBet = 8 
const betLines = {
  line1: ['a1', 'a2', 'a3'],

  line2: ['a1', 'b2', 'c3'],

  line3: ['b1', 'b2', 'b3'],

  line4: ['c1', 'b2', 'a3'],

  line5: ['c1', 'c2', 'c3'],
}
const minimalBet = lineBet * (Object.keys(betLines)).length // 40
const pocket = ref(initialPocket) // 5.000 centavos -> R$ 50,00
const currentBet = ref(minimalBet)
const historyBalance = ref(0)

const historyGame = ref([])

const canRoll = computed(() => pocket.value >= minimalBet)

function roll() {
  if(!canRoll.value) {
    notifyNotEnoughCredit()
    return 
  }
  chargeBet()
  spinAll()
  const winners = processResult()
  if(winners.length) {
    // adicionar o premio amo 
    const prize = processWinPrize(winners)
    pocket.value += prize
    notifyWin(prize)
    
  }
  // processLoss()
}
function notifyNotEnoughCredit() {
  notificationStore.setNotification({
    modal: true,
    text: 'Saldo insuficiente para jogar!',
    icon: 'mdi-emoticon-cry-outline',
    color: 'red-darken-1',
  })
}
function notifyWin(prize) {
  notificationStore.setNotification({
    modal: true,
    text: `Ganhou ${prize}`,
    icon: 'mdi-cash-multiple',
    color: 'green',
    //color: 'green-darken-1',
  })
}
function chargeBet() {
  pocket.value = pocket.value - currentBet.value
}

function processResult() {
  const round = {}
  const winners = []
  const figuresNames = figures.value.map((item) => item.name)
  for(const [ind, lines] of Object.entries(betLines)) {
    const winnerCandidate = [] // criar linhas de aposta que sao checadas
    for(const slot of lines) {
        const actualSlot = slots.value[slot]
        winnerCandidate.push( actualSlot.name)
    }

    for(const figName of figuresNames) { // 
      const hasWin = winnerCandidate.every((item) => item === figName)
      if(hasWin) {
        const winner = {}
        winner[ind] = figName
        winners.push(winner)
        round[ind] = hasWin 
        break
      }
      round[ind] = hasWin
    }
  }
  return winners
}
function processWinPrize(winners) {
  let multiplier = 0
  let prizeBucket = 0 //TODO: implementar reduce?
  for(const [line, figure] of Object.entries(winners)) {
    multiplier++
    const winnerName = Object.values(figure)[0]
    const figureByName = figures.value.find((item) => item.name === winnerName)
    prizeBucket += figureByName.prize * (currentBet.value / 5)
    // cada aposta de *giro* é na verdade uma aposta obrigatoria para cada linha de aposta
    // isso justifica 
  }
  const finalPrize = multiplier * prizeBucket 
  console.log('finalPrize', finalPrize)
  return finalPrize
}
</script>
