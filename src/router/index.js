// Composables
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Guest.vue'),
    redirect: '/game',
    children: [
      {
        path: 'game',
        name: 'game',
        component: () => import('@/views/Game.vue'),
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/views/Help.vue'),
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/History.vue'),
      },
    ],
  },

]

const url = process.env.BASE_URL || 'https://master--oncinha-game.netlify.app'
const router = createRouter({
  history: createWebHistory(url),
  routes,
})

export default router
