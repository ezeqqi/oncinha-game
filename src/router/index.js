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
        path: 'history',
        name: 'history',
        component: () => import('@/views/History.vue'),
      },
    ],
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
