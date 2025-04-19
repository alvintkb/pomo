import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Import your components
import Home from '../Views/Home.vue';
import pomodoroTask from '../Views/pomodoroTask.vue';
import pomodoroTimer from '../Views/pomodoroTimer.vue';
import taskList from '../components/TaskList.vue';
import Login from '../Views/Login.vue';
import Score from '../Views/Score.vue';
import subjects from '../Views/subjects.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/pomodoroTask',
    name: 'pomodoroTask',
    component: pomodoroTask,
    meta: { requiresAuth: true },
  },
  {
    path: '/pomodoroTimer',
    name: 'pomodoroTimer',
    component: pomodoroTimer,
    meta: { requiresAuth: true },
  },
  {
    path: '/subjects',
    name: 'subjects',
    component: subjects,
    meta: { requiresAuth: true },
  },
  {
    path: '/taskList',
    name: 'taskList',
    component: taskList,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/score',
    name: 'Score',
    component: Score,
    meta: { requiresAuth: true },
  },
  // Add catch-all route to redirect unmatched paths to Home
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Home' },
  },
];

const routerInstance = createRouter({
  history: createWebHistory('/Pomo/'),
  routes,
});

routerInstance.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

routerInstance.isReady().then(() => {
  if (routerInstance.currentRoute.value.fullPath === '/Pomo/') {
    routerInstance.push({ name: 'Home' });
  }
});

export default routerInstance;