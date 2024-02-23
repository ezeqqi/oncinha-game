<template>
  <div style="height: 100%;">
    <v-row class="justify-around mb-10 mt-2">
      <v-col class="px-0">
        <v-btn flat title="Ajuda" class="clickable" :to="{name: 'help'}">
          <v-icon icon="mdi-help-circle-outline" size="24" class="" />
        </v-btn>
      </v-col>
      <v-col cols="" class="text-right px-0">
        <v-btn flat id="menu-activator" title="Carteira">
          <v-icon icon="mdi-piggy-bank" class="mr-2"/>
          {{ pointsToMoney(pocket) }}
        </v-btn>
        <v-menu activator="#menu-activator">
          <v-list>
            <v-list-item @click="addFunds">
              <v-list-item-title>
                <v-icon icon="mdi-plus" />
                Add funds
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="justify-center border-sm">
      <v-col v-for="(slot, i) of slots" cols="4" class="slot text-center border-sm " :key="i">
        <div :class="slot?.line ?? ''">
          <v-scroll-y-transition hide-on-leave>
            <div class="" v-show="!!slot" >
              <v-icon
                size="40"
                :icon="slot?.image || 'mdi-minus'"
                :color="slot?.color || 'grey-darken-2'"
                class="mx-auto"
              />
            </div>
          </v-scroll-y-transition>
          <v-scroll-y-reverse-transition hide-on-leave>
            <div v-show="!slot">
              <v-icon
                size="40"
                icon="mdi-minus"
                color="grey-darken-2"
                class="mx-auto"
              />
            </div>
          </v-scroll-y-reverse-transition>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="addModal.modal" width="auto">
      <v-card>
        <v-card-title class="text-subtitle1"> Adicionar fundos </v-card-title>
        <v-card-text class="my-5">
          <!-- <label for="addFunds">Current Bet</label> -->
          <v-select
            id="addFunds"
            v-model="addModal.funds"
            flat
            variant="solo"
            :items="fundsOptions"
            density="compact"
            color="grey-darken-3"
            dense
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey-darken-1" @click="cancelFunds">Cancel</v-btn>
          <v-btn color="primary" @click="confirmFunds">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row class="justify-between mt-10">
      <v-col cols="auto" class="border- px-0" title="Valor de aposta">
        <!-- <label for="currentBet">Current Bet</label> -->
        <v-select
          id="currentBet"
          v-model="currentBet"
          flat
          variant="solo"
          :items="betOptions"
          density="compact"
          color="grey-darken-3"
          dense
          hide-details
        >
          <template v-slot:prepend-inner="{props}">
            <v-icon icon="mdi-hand-coin" class="mr-1" />
          </template>
        </v-select>
      </v-col>
      <v-col class="text-center border- d-flex justify-end align-center" title="Prêmios">
        <v-icon icon="mdi-cash-multiple" class="mr-1" />
        {{ pointsToMoney(historyBalance) }}
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="auto" class="max-4">
        <v-btn size="120" :variant="disabled ? 'plain' : 'elevated'" rounded elevation="10" @click.stop="roll" :disabled="disabled">
          <v-icon size="60" icon="mdi-motion" color="grey-lighten-2" class="mx-auto" />
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="justify-between mt-4">
      <v-col class="max-4 px-0">
        <v-btn rounded elevation="4" @click.stop="saveHistory">
          <v-icon icon="mdi-content-save" color="grey-lighten-2" class="mx-auto" />
        </v-btn>
      </v-col>
      <v-col class="max-4 px-0 text-right">
        <v-btn rounded elevation="4" @click.stop="toHistory">
          <v-icon icon="mdi-history" color="grey-lighten-2" class="mx-auto" />
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useRouter } from "vue-router";
const router = useRouter()
const notificationStore = useNotificationStore();
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
const disabled = ref(false)
//      # SLOTS
//
//      1     2     3
//
// A    A1    A2    A3
//
// B    B1    B2    B3
//
// C    C1    C2    C3

const chances_test = [64, 32, 16, 8, 4, 2, 1];
// RNG  <= 64

const chances_two = [48, 40, 20, 10, 6, 2, 1];

// ROLL  <=  48    <=  88    <=  108   <=  118   <=  124   <=  126   ==  127
//           tar       grç       ara       mic       pxe       lob       ONÇA
function spin() {
  const random = Math.floor(Math.random() * 128);
  // const random = 127
  // odds | odds2 | odds_alt
  const slot = Object.assign({random}, mappFigureByNumber(random, 'odds'))
  return slot
}

function mappFigureByNumber(num, oddType) {
  let accumulator = 0;
  for (let i = 0; i < figures.value.length; i++) {
    let figure = figures.value[i];
    accumulator += figure[oddType];
    if (num <= accumulator) {
      return figure;
    }
  }
}
function spinAll() {
  let i = 100
  for (const cell in slots.value) {
    setTimeout(() => {
      slots.value[cell] = spin()
    }, i)
    i += 100
  }
}
function clearAll() {
  let i = 100
  for (const cell in slots.value) {
    setTimeout(() => {
      slots.value[cell] = null
    }, i)
    i += 100
  }
}
const bettingTokens = [40, 200, 1000, 5000];
const initialPocket = 5000;
// essa bet é uma soma do minimo de aposta por linha de aposta: 5(betLines) * 8(lineBet)
const lineBet = 8;
const betLines = {
  line1: ["a1", "a2", "a3"],

  line2: ["a1", "b2", "c3"],

  line3: ["b1", "b2", "b3"],

  line4: ["c1", "b2", "a3"],

  line5: ["c1", "c2", "c3"],
};
const betOptions = ref(processBetOptions());
function processBetOptions(fund) {
  const increasedTokens = bettingTokens.map((item) => {
    const multipliedTokens = [];
    for (let i = 1; i < 5; i++) {
      multipliedTokens.push(item * i);
    }
    return multipliedTokens;
  });
  const flattened = increasedTokens.flat();
  const moneyOptions = flattened.map((bet) => {
    return {
      value: bet,
      title: pointsToMoney(bet)
    }
  });
  if(fund) {
    moneyOptions.unshift({value: 0 , title: pointsToMoney(0)})
  }
  return moneyOptions
}
const minimalBet = lineBet * Object.keys(betLines).length; // 40
const pocket = ref(initialPocket); // 5.000 centavos -> R$ 50,00
const currentBet = ref(minimalBet);
const historyBalance = computed(() => historyGame.value.reduce((acc, item) => acc + item.prize, 0));

const historyGame = ref([]);

const canRoll = computed(() => pocket.value >= currentBet.value);

function animateSlots() {
  clearAll() // 900
  notificationStore.resetState()
  setTimeout(() => {
    spinAll() // 900
  }, 1100)
}

function roll() {
  if (!canRoll.value) {
    notifyNotEnoughCredit();
    return;
  }
  disabled.value = true
  const pocketBefore = pocket.value;
  chargeBet();
  const bet = currentBet.value;
  //animate first
  animateSlots() // 1100
  setTimeout(() => {
    processAfterMatch(pocketBefore, bet)
  }, 2200)

}
const highlights = ref({
  a1: [],
  a2: [],
  a3: [],
  b1: [],
  b2: [],
  b3: [],
  c1: [],
  c2: [],
  c3: [],
})
function processAfterMatch(pocketBefore, bet) {
  const slotsResult = slots.value;
  const winners = processResult();
  let prize = 0;
  const loops = 4
  const interval = 150
  if (winners.length) {
    let lineDelay = 0

    for(const winner of Object.values(winners)) {
      const winnerKey = Object.keys(winner)[0]
      const figureName = Object.values(winner)[0]
      const originalColor = figures.value.find((item) => item.name === figureName).color
      const highligths = betLines[winnerKey]
      // acho que vou ter que implementar uma logica de acumulação de timeout para cada linha vencedora de higlight mas o desafio é fazer isso ao passo que meu loop está passando pelos slots e nao pelas linhas

      let roundDuration = (loops * (interval * 2) + interval) * lineDelay
      for(const slot of highligths) {

        const highlightColor = slots.value[slot].name ===  'Onça pintada' ? 'orange-darken-3' : originalColor
        const hideColor = 'grey-darken-2'

        const configColor = {
          one: highlightColor,
          two: hideColor,
          reference: slots.value[slot],
          key: 'color',
          interval,
          loops,
        }
        if(!!lineDelay) {
          setTimeout(() => {
            blink(configColor)
          }, roundDuration)
        }
        else {
          blink(configColor)
        }

      }

      lineDelay++
    }
    const allRoundsDuration = (loops * (interval * 2) + interval) * lineDelay

    setTimeout(() => {disabled.value = false}, allRoundsDuration)
    prize = processWinPrize(winners);
    givePrize(prize);
    notifyWin(prize);
  }
  if(!winners.length) { // 1100
    setTimeout(() => {disabled.value = false}, 150)
  }
  const matchData = {
    pocketBefore,
    bet,
    slotsResult,
    winners,
    prize,
  }
  matchResume(matchData)
}
function blink(config) {
  const { loops, interval, reference, key, one, two } = config
  reference[key] = one
  let acc = 1
  for(let i = 0; loops > i; i++) {
    setTimeout(() => {
        reference[key] = two
      },
      interval * acc
    )
    acc++
    setTimeout(() => {
        reference[key] = one
      },
      interval * acc
    )
    acc++
  }
}
function matchResume(info) {
  const { pocketBefore, bet, prize, slotsResult, winners } = info
  const balance = prize - bet;
  const now = new Date();
  const hour = now.toLocaleTimeString("pt-br");
  const calendar = new Intl.DateTimeFormat('pt-br').format(now)
  const date = `${calendar} ${hour}`
  const id = Math.floor(Math.random() * 128 * 128)
  const history = {
    id,
    pocketBefore,
    bet,
    slotsResult,
    winners,
    prize,
    balance,
    date,
  };
  historyGame.value.push(history);
}

function notifyNotEnoughCredit() {
  notificationStore.setNotification({
    modal: true,
    text: "Saldo insuficiente para jogar!",
    icon: "mdi-emoticon-cry-outline",
    color: "red-darken-1",
  });
}
function givePrize(prize) {
  pocket.value = pocket.value + prize;
}
function notifyWin(prize) {
  notificationStore.setNotification({
    modal: true,
    text: `Ganhou ${pointsToMoney(prize)}`,
    icon: "mdi-cash-multiple",
    color: "green",
  });
}
function chargeBet() {
  pocket.value = pocket.value - currentBet.value;
}

function processResult() {
  const winners = [];
  const figuresNames = figures.value.map((item) => item.name);
  for (const [ind, lines] of Object.entries(betLines)) {
    const winnerCandidate = []; // criar linhas de aposta que sao checadas
    for (const position of lines) {
      const slot = slots.value[position];
      winnerCandidate.push(slot.name);
    }
    for (const figName of figuresNames) {
      const wildFigure = 'Onça pintada'
      const hasWin = winnerCandidate.every((item) => item === figName || item === wildFigure);
      if (hasWin) {
        const winner = {};
        const wildWin = winnerCandidate.every((item) => item === wildFigure)
        const winnerFigure = wildWin ? wildFigure : figName
        winner[ind] = winnerFigure;
        winners.push(winner);
        break;
      }
    }
  }
  return winners;
}
function processWinPrize(winners) {
  let multiplier = 0;
  let prizeBucket = 0; //TODO: implementar reduce?
  for (const [line, figure] of Object.entries(winners)) {
    multiplier++;
    const winnerName = Object.values(figure)[0];
    const figureByName = figures.value.find((item) => item.name === winnerName);
    // console.log('figureByName', figureByName.name)
    // console.log('winnerName', winnerName)
    const linePrize =  figureByName.prize * (currentBet.value / 5);
    // console.log('line prize', linePrize)
    prizeBucket += linePrize
    // cada aposta de *giro* é na verdade uma aposta obrigatoria para cada linha de aposta
    // isso justifica
  }
  const finalPrize = multiplier * prizeBucket;
  // console.log('final prize', finalPrize)
  return finalPrize;
}
function processLoss() {
  //TODO:
  // - incrementar saldo da derrota e vitoria -> na verdade o saldo só incrementa *premios*
  // - salvar dados de um history
  // - definir aposta
  // - feedback visual das etapas + delay das etapas para compreensao -> event animations
  //
}
function pointsToMoney(val) {
  const price = val / 100;
  return price.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}
function moneyToPoints(val) {
  const numericValue = parseFloat(val.replace(/[^\d.,]/g, "").replace(",", "."));
  const points = numericValue * 100;
  return Math.round(points);
}
const addModal = ref({
  modal: false,
  funds: 0,
});
function addFunds() {
  addModal.value.modal = true;
}
function cancelFunds() {
  addModal.value.modal = false;
}
function confirmFunds() {
  pocket.value = pocket.value + addModal.value.funds;
  addModal.value = {
    modal: false,
    funds: 0,
  };
}
const fundsOptions = ref(processBetOptions('funds'));
function saveHistory() {
  const stories = JSON.stringify(historyGame.value)
  localStorage.setItem(`game-history`,stories)
}
// function loadHistory() {
//   return localStorage.getItem(`game-history`)
// }
function toHistory() {
  router.push({name: 'history'})
}
function getLine(i) {
  return 'line1'
}
onMounted(() => {
  spinAll()
})
</script>
<style>
.slot {
  width: 132px;
  height: 66px;
}
</style>
