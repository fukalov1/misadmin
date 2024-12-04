export default [
  {
    component: 'CNavItem',
    name: 'Главная',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavItem',
    name: 'Заявки диспетчера',
    to: '/service-requests',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Акты',
    to: '/acts',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Поверки',
    to: '/meters',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Статистика',
    to: '/statistic',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Профиль',
    to: '/profile',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Тех.поддержка',
    to: '/support',
    icon: 'cil-people',
  },
]
