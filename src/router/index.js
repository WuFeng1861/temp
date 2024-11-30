import { createRouter, createWebHistory } from 'vue-router'
import Casino from '@/components/Casino.vue'
import ApiDoc from '../views/ApiDoc.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import GameSelect from '../views/GameSelect.vue'
import TripleDice from '@/components/TripleDice.vue'
import RoomSelection from '@/components/RoomSelection.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/games'
  },
  {
    path: '/games',
    name: 'GameSelect',
    component: GameSelect,
    meta: { requiresAuth: true }
  },
  {
    path: '/casino',
    name: 'Casino',
    component: Casino,
    meta: { requiresAuth: true }
  },
  {
    path: '/apidoc',
    name: 'ApiDoc',
    component: ApiDoc
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/triple-dice',
    name: 'TripleDice',
    component: TripleDice,
    meta: { requiresAuth: true }
  },
  {
    path: '/room-selection',
    name: 'RoomSelection',
    component: RoomSelection,
    meta: { requiresAuth: true }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('../views/StatsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/games/dragon-tiger',
    name: 'DragonTiger',
    component: () => import('@/components/DragonTiger.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    if (!authStore.initAuth()) {
      return { name: 'Login' }
    }
  }
  
  if (authStore.isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    return { name: 'GameSelect' }
  }

  return true
})

export default router