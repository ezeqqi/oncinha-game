<template>
  <div style="height: 100%;">
    <v-row class="justify-end mb-10 mt-2">
      <v-col class="text-right px-0">
        <v-btn flat id="menu-activator">
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
      <v-col v-for="(slot, i) of slots" cols="4" class="text-center border-sm" :key="i">
        <v-icon
          size="40"
          :icon="slot?.image || 'mdi-minus'"
          :color="slot?.color || 'grey-darken-2'"
          class="mx-auto"
        />
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
            :item-title="pointsToMoney"
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
        />
      </v-col>
      <v-col class="text-center border- d-flex justify-end align-center">
        {{ pointsToMoney(historyBalance) }}
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="auto" class="max-4">
        <v-btn size="120" rounded elevation="10" @click.stop="roll">
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
    odds: 48,
    odds_alt: 64,
    image: "mdi-tortoise",
    color: "light-green-lighten-1",
  },
  {
    name: "Garça",
    prize: 5,
    odds: 40,
    odds_alt: 32,
    image: "mdi-bat",
    color: "deep-purple-lighten-3",
  },
  {
    name: "Arara",
    prize: 10,
    odds: 20,
    odds_alt: 16,
    image: "mdi-bird",
    color: "red",
  },
  {
    name: "Mico-leão",
    prize: 25,
    odds: 10,
    odds_alt: 8,
    image: "mdi-weather-sunny",
    color: "amber-lighten-1",
  },
  {
    name: "Peixe",
    prize: 50,
    odds: 6,
    odds_alt: 4,
    image: "mdi-fish",
    color: "cyan-lighten-3",
  },
  {
    name: "Lobo guará",
    prize: 100,
    odds: 2,
    odds_alt: 2,
    image: "mdi-dog-side",
    color: "brown-lighten-1",
  },
  {
    name: "Onça pintada",
    prize: 250,
    odds: 1,
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
  return mappFigureByNumber(random);
}

function mappFigureByNumber(num) {
  let accumulator = 0;
  for (let i = 0; i < figures.value.length; i++) {
    let figure = figures.value[i];
    accumulator += figure.odds;
    if (num <= accumulator) {
      return figure;
    }
  }
}
function spinAll() {
  for (const cell in slots.value) {
    slots.value[cell] = spin();
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
function processBetOptions() {
  const increasedTokens = bettingTokens.map((item) => {
    const multipliedTokens = [];
    for (let i = 1; i < 5; i++) {
      multipliedTokens.push(item * i);
    }
    return multipliedTokens;
  });
  const flattened = increasedTokens.flat();
  return flattened.map((bet) => {
    return {
      value: bet,
      title: pointsToMoney(bet)
    }
  });
}
const minimalBet = lineBet * Object.keys(betLines).length; // 40
const pocket = ref(initialPocket); // 5.000 centavos -> R$ 50,00
const currentBet = ref(minimalBet);
const historyBalance = computed(() => historyGame.value.reduce((acc, item) => acc + item.prize, 0));

const historyGame = ref([]);

//const canRoll = computed(() => pocket.value >= currentBet.value)
const canRoll = computed(() => pocket.value >= currentBet.value);

function roll() {
  if (!canRoll.value) {
    notifyNotEnoughCredit();
    return;
  }
  const pocketBefore = pocket.value;
  chargeBet();
  const bet = currentBet.value;
  spinAll();
  const slotsResult = slots.value;
  const winners = processResult();
  let prize = 0;
  if (winners.length) {
    // adicionar o premio ao pocket
    prize = processWinPrize(winners);
    givePrize(prize);
    pocket.value += prize;
    //historyBalance.value += prize aqui deve virar um computed
    notifyWin(prize);
  }
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
  //processLoss()
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
  const round = {};
  const winners = [];
  const figuresNames = figures.value.map((item) => item.name);
  for (const [ind, lines] of Object.entries(betLines)) {
    const winnerCandidate = []; // criar linhas de aposta que sao checadas
    for (const position of lines) {
      const slot = slots.value[position];
      winnerCandidate.push(slot.name);
    }

    for (const figName of figuresNames) {
      //
      const hasWin = winnerCandidate.every((item) => item === figName);
      if (hasWin) {
        const winner = {};
        winner[ind] = figName;
        winners.push(winner);
        round[ind] = hasWin;
        break;
      }
      round[ind] = hasWin;
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
    prizeBucket += figureByName.prize * (currentBet.value / 5);
    // cada aposta de *giro* é na verdade uma aposta obrigatoria para cada linha de aposta
    // isso justifica
  }
  const finalPrize = multiplier * prizeBucket;
  console.log("finalPrize", finalPrize);
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
  pocket.value = pocket.value + moneyToPoints(addModal.value.funds);
  addModal.value = {
    modal: false,
    funds: 0,
  };
}
const fundsOptions = ref(processBetOptions());
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
</script>
