import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import middlewarePipeline from './middlewarePipeline'
import { useUserStore } from '@/stores/user.js'
import { getCookie } from '@/helpers/cookie'
import { USER_REQUEST } from '@/api/user'

import DefaultLayout from '@/layouts/DefaultLayout'

import isUser from "./middleware/isUser";

const routes = [
  {
    path: '/',
    name: 'Главная',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Дашбоард',
        meta: { title: 'Система статистики', auth: true },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
          ),
      },
      {
        path: '/service-requests',
        name: 'Заявки',
        meta: { title: 'Заявки на поверку', auth: true,
          middleware: [
            isUser
          ]},
        component: () => import('@/views/pages/ServiceRequests.vue'),
      },
      {
        path: '/acts',
        name: 'Акты',
        meta: { title: 'Акты', auth: true,
          middleware: [
            isUser
          ]},
        component: () => import('@/views/pages/Acts.vue'),
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Страница не найдена',
        meta: { title: 'Страница не найдена', auth: false },
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Ошибка сервера',
        meta: { title: 'Ошибка 500', auth: false },
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Вход',
        meta: { title: 'Авторизация', auth: false },
        component: () => import('@/views/pages/Login'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = getCookie('api_token')

  const currentUser = useUserStore()

  if (token) {
    currentUser.login(token)
    // console.log('check user ', currentUser.user.id)
    // if (currentUser.user===null)
      USER_REQUEST()
  }

  if (currentUser.isLoggedIn===false && to.path !== '/pages/login') {
    // console.log('test', !currentAuth.isLoggin, from.path, to.meta.auth)
    next({ path: "/pages/login" })
  }
  else if(currentUser.isLoggedIn === true  && to.path === '/pages/login') {
    next({ path: "/dashboard" })
  }
  else if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
  }
  if (middleware)
    if (middleware.length)
      return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
        currentUser
      })
    else
      return next()
})

export default router
