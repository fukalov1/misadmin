export default [
  {
    component: 'CNavItem',
    name: 'Главная',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
    },
    roles: [{id: 1},{id: 2},{id: 3},{id: 4}]
  },
  {
    component: 'CNavItem',
    name: 'Заявки агента',
    to: '/agent-service-requests',
    icon: 'cil-list',
    props: true,
    roles: [{id: 4}]
  },
  {
    component: 'CNavItem',
    name: 'Заявки диспетчера',
    to: '/service-requests',
    icon: 'cil-list',
    roles: [{id: 1},{id: 2},{id: 3}]
  },
  {
    component: 'CNavItem',
    name: 'Акты',
    to: '/acts',
    icon: 'cil-star',
    roles: [{id: 1},{id: 2},{id: 3},{id: 4}]
  },
  {
    component: 'CNavItem',
    name: 'Поверки',
    to: '/meters',
    icon: 'cil-drop',
    roles: [{id: 1},{id: 2},{id: 3},{id: 4}]
  },
  {
    component: 'CNavItem',
    name: 'Оплата пакетов',
    to: '/payment',
    icon: 'cil-dollar',
    roles: [{id: 1},{id: 2},{id: 3}]
  },
  {
    component: 'CNavItem',
    name: 'Платежи',
    to: '/payments',
    icon: 'cil-dollar',
    roles: [{id: 1},{id: 2},{id: 3}]
  },
  {
    component: 'CNavItem',
    name: 'Статистика',
    to: '/statistic',
    icon: 'cil-chart-pie',
    roles: [{id: 1},{id: 2},{id: 3}]
  },
  {
    component: 'CNavItem',
    name: 'Тех.поддержка',
    to: '/support',
    icon: 'cil-people',
    roles: [{id: 1},{id: 2},{id: 3},{id: 4}]
  },
  {
    component: 'CNavItem',
    name: 'Агенты',
    to: '/agents',
    icon: 'cil-people',
    roles: [{id: 1},{id: 2},{id: 3}]
  },
]
