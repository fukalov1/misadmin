export default [
  {
    component: 'CNavItem',
    name: 'Главная',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
    },
  },
  {
    component: 'CNavItem',
    name: 'Заявки диспетчера',
    to: '/service-requests',
    icon: 'cil-list',
  },
  {
    component: 'CNavItem',
    name: 'Акты',
    to: '/acts',
    icon: 'cil-star',
  },
  {
    component: 'CNavItem',
    name: 'Поверки',
    to: '/meters',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: 'Оплата пакетов',
    to: '/payment',
    icon: 'cil-dollar',
  },
  {
    component: 'CNavItem',
    name: 'Платежи',
    to: '/payments',
    icon: 'cil-dollar',
  },
  {
    component: 'CNavItem',
    name: 'Статистика',
    to: '/statistic',
    icon: 'cil-chart-pie',
  },
  {
    component: 'CNavItem',
    name: 'Тех.поддержка',
    to: '/support',
    icon: 'cil-people',
  },
]
